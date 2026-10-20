
export function createMetrics(windowSeconds = 5) {
  return {
    windowSeconds,
    completions: [],
    latencies: [],
  }
}

// Clear all recorded metrics
export function resetMetrics(metrics) {
  metrics.completions = []
  metrics.latencies = []
}

// Remove old records outside the time window
function prune(metrics, currentTime) {
  const cutoff = currentTime - metrics.windowSeconds

  while (
    metrics.completions.length > 0 &&
    metrics.completions[0] < cutoff
  ) {
    metrics.completions.shift()
  }

  while (
    metrics.latencies.length > 0 &&
    metrics.latencies[0].t < cutoff
  ) {
    metrics.latencies.shift()
  }
}

// Record one completed task and its latency
export function recordCompletion(metrics, time, latency) {
  metrics.completions.push(time)
  metrics.latencies.push({ t: time, latency })
}

// Find a percentile value
function percentile(sortedLatencies, percent) {
  if (sortedLatencies.length === 0) return 0

  const index = Math.min(
    sortedLatencies.length - 1,
    Math.floor(percent * sortedLatencies.length)
  )

  return sortedLatencies[index]
}

// Calculate the current metrics
export function snapshotMetrics(metrics, state, config) {
  prune(metrics, state.t)

  // Get all latencies and sort them from lowest to highest
  const latencies = metrics.latencies
    .map((item) => item.latency)
    .sort((a, b) => a - b)

  // Count active consumers
  const active = Math.min(
    config.activeConsumers,
    state.consumers.length
  )

  let busy = 0

  for (let i = 0; i < active; i++) {
    if (state.consumers[i].phase !== 'idle') {
      busy++
    }
  }

  // Calculate utilization
  const consumerUtilization = active > 0 ? busy / active : 0

  const poolUtilization = config.poolSize > 0
    ? state.poolUsed / config.poolSize
    : 0

  // Return all metrics
  return {
    t: state.t,

    queueDepth: state.queue.length,
    queueCapacity: config.queueCapacity,

    completedPerSecond:
      metrics.completions.length / metrics.windowSeconds,

    p50: percentile(latencies, 0.50),
    p95: percentile(latencies, 0.95),

    consumerUtilization,

    poolUsed: state.poolUsed,
    poolSize: config.poolSize,
    poolUtilization,

    completed: state.counters.completed,
    rejected: state.counters.rejected,
    failed: state.counters.failed,
    deadLettered: state.counters.deadLettered,
  }
}
