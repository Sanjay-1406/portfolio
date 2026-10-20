// useSimulation.js — runs the engine from requestAnimationFrame, exposes engine + UI numbers
import { useEffect, useRef, useState } from "react";
import { createEngine, FIXED_DT } from "../simulation/engine.js";

export function useSimulation(config, seed = 12345) {
  const engineRef = useRef(null);
  if (engineRef.current === null) {
    engineRef.current = createEngine(config, seed);
  }

  const [snapshot, setSnapshot] = useState(() => engineRef.current.snapshot());

  useEffect(() => {
    let raf;
    let last = performance.now();
    let accumulator = 0;
    let lastUi = 0;

    const loop = (now) => {
      const frame = Math.min((now - last) / 1000, 0.25); // clamp after tab switches
      last = now;
      accumulator += frame;

      // Fixed-timestep: run the model at exactly 30 steps per second,
      // independent of monitor refresh rate.
      while (accumulator >= FIXED_DT) {
        engineRef.current.step(FIXED_DT);
        accumulator -= FIXED_DT;
      }

      // React re-renders ~10x/sec. Never per frame.
      if (now - lastUi > 100) {
        lastUi = now;
        setSnapshot(engineRef.current.snapshot());
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { engineRef, snapshot };
}
