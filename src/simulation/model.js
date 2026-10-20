// model.js — queue simulation
import { poisson } from "./rng.js";

// Create the initial simulation state
export function createState(config) {
  const maxConsumers = config.maxConsumers ?? 32;
  const virtualUsers = config.virtualUsers ?? 0;

  return {
    t: 0,
    nextId: 1,

    queue: [],

    consumers: Array.from({ length: maxConsumers }, () => ({
      phase: "idle",
      msg: null,
      remaining: 0,
    })),

    poolUsed: 0,

    users: Array.from({ length: virtualUsers }, () => ({
      busy: false,
      thinkUntil: 0,
    })),

    counters: {
      completed: 0,
      rejected: 0,
      failed: 0,
      deadLettered: 0,
    },
  };
}

// Let a virtual user send another request later
function releaseUser(state, config, user) {
  user.busy = false;
  user.thinkUntil = state.t + config.thinkTime;
}

// Add a new message to the queue
function enqueue(state, config, emit, user) {
  if (state.queue.length >= config.queueCapacity) {
    state.counters.rejected++;
    emit({ type: "rejected" });

    if (user) {
      releaseUser(state, config, user);
    }

    return;
  }

  const message = {
    id: state.nextId++,
    enqueuedAt: state.t,
    attempts: 0,
    user,
  };

  state.queue.push(message);
  emit({ type: "arrived", id: message.id });
}

// Finish processing a message
function finish(state, config, rng, emit, consumer) {
  const message = consumer.msg;
  const failed = rng() < config.failProbability;

  if (failed) {
    state.counters.failed++;

    // Retry the message if retries are available
    if (message.attempts < config.maxRetries) {
      message.attempts++;
      state.queue.push(message);

      emit({
        type: "retried",
        id: message.id,
        attempt: message.attempts,
      });

      consumer.phase = "idle";
      consumer.msg = null;
      return;
    }

    // No retries remain
    state.counters.deadLettered++;

    emit({
      type: "deadLettered",
      id: message.id,
    });
  } else {
    // Message completed successfully
    state.counters.completed++;

    emit({
      type: "completed",
      id: message.id,
      latency: state.t - message.enqueuedAt,
    });
  }

  if (message.user) {
    releaseUser(state, config, message.user);
  }

  consumer.phase = "idle";
  consumer.msg = null;
}

// Advance the simulation by one time step
export function step(state, dt, config, rng, emit = () => {}) {
  state.t += dt;

  // 1. Generate new messages
  if (config.mode === "open") {
    const arrivals = poisson(rng, config.arrivalRate * dt);

    for (let i = 0; i < arrivals; i++) {
      enqueue(state, config, emit, null);
    }
  } else {
    // Virtual users send another request when ready
    for (const user of state.users) {
      if (user.busy || user.thinkUntil > state.t) {
        continue;
      }

      user.busy = true;
      enqueue(state, config, emit, user);
    }
  }

 // 2. Process messages using active consumers
  const active = Math.min(
    config.activeConsumers,
    state.consumers.length
  )

  for (let i = 0; i < active; i++) {
    const consumer = state.consumers[i]

    // Start a message
    if (consumer.phase === 'idle') {
      if (state.queue.length === 0) continue

      consumer.msg = state.queue.shift()
      consumer.remaining = config.cpuTime
      consumer.phase = 'cpu'

      emit({ type: 'started', id: consumer.msg.id })
    }

    // Process CPU work
    if (consumer.phase === 'cpu') {
      consumer.remaining -= dt

      if (consumer.remaining > 0) continue

      if (config.dbTime <= 0) {
        finish(state, config, rng, emit, consumer)
        continue
      }

      consumer.phase = 'waitingDb'
    }

    // Wait for a database connection
    if (consumer.phase === 'waitingDb') {
      if (state.poolUsed >= config.poolSize) continue

      state.poolUsed++
      consumer.remaining = config.dbTime
      consumer.phase = 'db'
      continue
    }

    // Process database work
    if (consumer.phase === 'db') {
      consumer.remaining -= dt

      if (consumer.remaining <= 0) {
        state.poolUsed--
        finish(state, config, rng, emit, consumer)
      }
    }
  }
}