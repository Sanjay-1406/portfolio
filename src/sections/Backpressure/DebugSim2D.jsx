// DebugSim2D.jsx — throwaway 2D view with sliders. Later becomes Fallback2D.
import { useState } from 'react'
import { useSimulation } from '../../hooks/useSimulation.js'
import { scenarios } from '../../simulation/scenarios.js'

export function DebugSim2D() {
  const { engineRef, snapshot } = useSimulation()
  const [rate, setRate] = useState(50)
  const [consumers, setConsumers] = useState(4)
  const [pool, setPool] = useState(4)
  const [scenario, setScenario] = useState(null)

  const apply = (patch) => engineRef.current.setConfig(patch)

  return (
    <div className="sim2d">
      <p className="mono">SIMULATED</p>

      <div className="sim2d__bar">
        <div
          className="sim2d__fill"
          style={{
            height: `${Math.min(100, (snapshot.queueDepth / snapshot.queueCapacity) * 100)}%`,
          }}
        />
      </div>

      <dl className="sim2d__metrics">
        <div><dt>Queue depth</dt><dd>{snapshot.queueDepth} / {snapshot.queueCapacity}</dd></div>
        <div><dt>Completed/s</dt><dd>{snapshot.completedPerSecond.toFixed(1)}</dd></div>
        <div><dt>p50</dt><dd>{(snapshot.p50 * 1000).toFixed(0)} ms</dd></div>
        <div><dt>p95</dt><dd>{(snapshot.p95 * 1000).toFixed(0)} ms</dd></div>
        <div><dt>Consumers</dt><dd>{(snapshot.consumerUtilization * 100).toFixed(0)}%</dd></div>
        <div><dt>Pool</dt><dd>{snapshot.poolUsed} / {snapshot.poolSize}</dd></div>
        <div><dt>Rejected</dt><dd>{snapshot.rejected}</dd></div>
        <div><dt>Dead-lettered</dt><dd>{snapshot.deadLettered}</dd></div>
      </dl>

      <label>
        Arrival rate: {rate}/s
        <input type="range" min="1" max="300" value={rate}
          onChange={(e) => { setRate(+e.target.value); apply({ arrivalRate: +e.target.value }) }} />
      </label>

      <label>
        Consumers: {consumers}
        <input type="range" min="1" max="16" value={consumers}
          onChange={(e) => { setConsumers(+e.target.value); apply({ activeConsumers: +e.target.value }) }} />
      </label>

      <label>
        DB pool: {pool}
        <input type="range" min="1" max="16" value={pool}
          onChange={(e) => { setPool(+e.target.value); apply({ poolSize: +e.target.value }) }} />
      </label>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {Object.values(scenarios).map((s) => (
          <button key={s.id} className="btn"
            onClick={() => { s.apply(engineRef.current); setScenario(s) }}>
            {s.label}
          </button>
        ))}
        <button className="btn" onClick={() => {
          engineRef.current.reset()
          setRate(50); setConsumers(4); setPool(4); setScenario(null)
          engineRef.current.setConfig({ arrivalRate: 50, activeConsumers: 4, poolSize: 4 })
        }}>Reset</button>
      </div>

      {scenario && (
        <div className="mono" style={{ marginTop: 12 }}>
          <p><strong>Cause:</strong> {scenario.cause}</p>
          <p><strong>Effect:</strong> {scenario.effect}</p>
          <p><strong>Fix:</strong> {scenario.fix}</p>
        </div>
      )}
    </div>
  )
}