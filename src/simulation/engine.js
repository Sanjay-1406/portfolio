// engine.js — controls the simulation

import { createRng } from "./rng.js";
import { createState, step as stepModel } from "./model.js";
import {
  createMetrics,
  resetMetrics,
  recordCompletion,
  snapshotMetrics,
} from "./metrics.js";

// Run the simulation at 30 steps per second
export const FIXED_DT = 1 / 30;

// Default simulation settings
export const DEFAULT_CONFIG = {
  mode: "open",
  arrivalRate: 50,
  queueCapacity: 100,
  activeConsumers: 4,
  maxConsumers: 32,
  cpuTime: 0.05,
  dbTime: 0.02,
  poolSize: 4,
  failProbability: 0.0,
  maxRetries: 3,
  virtualUsers: 0,
  thinkTime: 0.5,
};

// Store recent events
function createEventBuffer(capacity = 4096) {
  const events = [];

  return {
    push(event) {
      events.push(event);

      // Remove oldest events if the buffer is full
      if (events.length > capacity) {
        events.shift();
      }
    },

    drain() {
      return events.splice(0, events.length);
    },

    clear() {
      events.length = 0;
    },
  };
}

// Create and control the simulation
export function createEngine(initialConfig = {}, seed = 12345) {
  const config = {
    ...DEFAULT_CONFIG,
    ...initialConfig,
  };

  let state = createState(config);
  let rng = createRng(seed);

  const metrics = createMetrics(5);
  const events = createEventBuffer();

  let running = true;

  return {
    config,
    events,

    // Get the current simulation state
    get state() {
      return state;
    },

    // Check whether the simulation is running
    isRunning() {
      return running;
    },

    // Start the simulation
    start() {
      running = true;
    },

    // Pause the simulation
    pause() {
      running = false;
    },

    // Update simulation settings
    setConfig(newConfig) {
      Object.assign(config, newConfig);
    },

    // Reset the simulation
    reset() {
      state = createState(config);
      rng = createRng(seed);

      resetMetrics(metrics);
      events.clear();
    },

    // Advance the simulation
    step(dt = FIXED_DT) {
      if (!running) return;

      stepModel(state, dt, config, rng, (event) => {
        // Record successful task completions
        if (event.type === "completed") {
          recordCompletion(metrics, state.t, event.latency);
        }

        // Save the event
        events.push(event);
      });
    },

    // Get current performance metrics
    snapshot() {
      return snapshotMetrics(metrics, state, config);
    },
  };
}
