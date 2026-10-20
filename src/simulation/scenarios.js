// scenarios.js — predefined simulation scenarios

export const scenarios = {
  // Scenario 1: Too many incoming requests
  trafficSpike: {
    id: "trafficSpike",
    label: "Traffic spike",

    apply: (engine) => {
      const currentRate = engine.config.arrivalRate;
      engine.setConfig({
        arrivalRate: currentRate * 3,
      });
    },

    cause: "Requests are arriving faster than the workers can process them.",
    effect: "The queue is growing and latency is climbing.",
    fix: "Add consumers, or reduce the incoming load.",
  },

  // Scenario 2: Database is too slow
  slowDatabase: {
    id: "slowDatabase",
    label: "Slow database",

    apply: (engine) => {
      const currentTime = engine.config.dbTime;
      engine.setConfig({
        dbTime: currentTime * 4,
      });
    },

    cause: "Workers are available, but database access is limiting throughput.",
    effect: "Consumers wait for connections while the queue grows.",
    fix: "Increase the pool size or reduce time per query. More consumers alone will not help.",
  },

  // Scenario 3: Fewer workers are available
  consumerFailure: {
    id: "consumerFailure",
    label: "Consumer failure",

    apply: (engine) => {
      const currentConsumers = engine.config.activeConsumers;
      const fewerConsumers = Math.max(1, Math.floor(currentConsumers / 2));

      engine.setConfig({
        activeConsumers: fewerConsumers,
      });
    },

    cause: "Fewer workers are available.",
    effect: "Pending messages accumulate because capacity dropped.",
    fix: "Restore capacity and watch the queue drain.",
  },
};
