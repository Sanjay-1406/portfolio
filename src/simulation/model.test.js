// model.test.js — unit tests for the model and engine
import { describe, it, expect } from "vitest";
import { createEngine, FIXED_DT, DEFAULT_CONFIG } from "./engine.js";

function run(engine, seconds) {
  const steps = Math.round(seconds / FIXED_DT);
  for (let i = 0; i < steps; i++) engine.step(FIXED_DT);
  return engine.state;
}

describe("queue model", () => {
  it("keeps the queue bounded under a stable workload", () => {
    const engine = createEngine({
      arrivalRate: 30,
      queueCapacity: 100,
      activeConsumers: 4,
      cpuTime: 0.05,
      dbTime: 0.02,
      poolSize: 4,
    });
    run(engine, 30);
    expect(engine.state.queue.length).toBeLessThan(100);
    expect(engine.state.counters.completed).toBeGreaterThan(0);
  });

  it("rejects messages when overloaded", () => {
    const engine = createEngine({
      arrivalRate: 500,
      queueCapacity: 50,
      activeConsumers: 2,
      cpuTime: 0.05,
      dbTime: 0.02,
      poolSize: 2,
    });
    run(engine, 10);
    expect(engine.state.counters.rejected).toBeGreaterThan(0);
  });

  it("more consumers do not help when the DB pool is the bottleneck", () => {
    const base = {
      arrivalRate: 200,
      queueCapacity: 100000,
      cpuTime: 0.001, // very short CPU — the point is DB, not CPU
      dbTime: 0.05, // slow DB
      poolSize: 1, // ONE connection — the bottleneck
    };
    const few = createEngine({ ...base, activeConsumers: 8 });
    const many = createEngine({ ...base, activeConsumers: 32 });
    run(few, 30);
    run(many, 30);
    const a = few.state.counters.completed;
    const b = many.state.counters.completed;

    // 4x the consumers, but pool caps throughput → b should be ≈ a
    expect(b / a).toBeLessThan(1.2);

    // Sanity: both are far below the arrival rate (200/s × 30s = 6000)
    expect(a).toBeLessThan(2000);
    expect(b).toBeLessThan(2000);
  });

  it("same seed produces the same result", () => {
    const cfg = { ...DEFAULT_CONFIG, arrivalRate: 80, failProbability: 0.1 };
    const a = createEngine(cfg, 42);
    const b = createEngine(cfg, 42);
    run(a, 20);
    run(b, 20);
    expect(a.state.counters.completed).toBe(b.state.counters.completed);
    expect(a.state.counters.rejected).toBe(b.state.counters.rejected);
  });

  it("recovers after adding capacity", () => {
    const engine = createEngine({
      arrivalRate: 50, // moderate load
      queueCapacity: 5000,
      activeConsumers: 1, // clearly not enough
      poolSize: 8, // plenty of pool — pool is not the bottleneck
      cpuTime: 0.05,
      dbTime: 0.02,
    });
    run(engine, 10);
    const peak = engine.state.queue.length;
    expect(peak).toBeGreaterThan(100); // queue actually grew, otherwise test is meaningless

    engine.setConfig({ activeConsumers: 16 }); // plenty of consumers
    run(engine, 30); // long enough to clearly drain

    expect(engine.state.queue.length).toBeLessThan(peak / 2); // clearly drained
  });
});
