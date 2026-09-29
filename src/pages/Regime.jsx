import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import {
  Wind,
  Layers,
  Activity,
  Compass,
  CheckCircle2,
  Info,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import useAsync from '../hooks/useAsync'
import { useSite } from '../hooks/useSite'
import { getPrediction, getMetadata } from '../services/api'
import { Async, Card, PageHeader, SourceBadge } from '../components/common/common'
import { RegimeCard, ProbabilityChart } from '../components/dashboard/dashboard'
import { pct, regimeName, regimeTitle, REGIME_DETAILS } from '../utils/format'

export default function Regime() {
  const { loc, horizon, caseStudy } = useSite()
  const pred = useAsync(
    () => getPrediction(loc, horizon, caseStudy),
    [loc.lat, loc.lon, horizon, caseStudy]
  )
  const meta = useAsync(getMetadata, [])
  const [selectedRegimeKey, setSelectedRegimeKey] = useState('ACTIVE_MONSOON')

  return (
    <div className="space-y-6">
      <Async state={pred} loading="Analyzing atmospheric synoptic circulation...">
        {(p) => {
          const topClass = p.classProbs?.[0]
          const secondClass = p.classProbs?.[1]
          const margin = topClass && secondClass ? topClass.value - secondClass.value : 0

          return (
            <>
              <PageHeader
                title="Monsoon Weather Regime Classification"
                source={p.source}
                note="Stage 1 LightGBM multiclass classification of synoptic circulation patterns over the Indian subcontinent."
              />

              {/* Top Overview: Detected Regime + Probabilities */}
              <div className="grid gap-6 lg:grid-cols-3">
                <RegimeCard p={p} />
                <div className="lg:col-span-2">
                  <ProbabilityChart p={p} />
                </div>
              </div>

              {/* Atmospheric Sounding & Synoptic Circulation Indicators */}
              <Card
                title="Synoptic Atmospheric Sounding & Dynamics"
                subtitle="NWP dynamical field extractions used by the Stage 1 multiclass classifier"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(p.synopticIndicators || []).map((ind) => (
                    <div
                      key={ind.name}
                      className="rounded-lg border border-line bg-card p-4 space-y-1"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {ind.name}
                      </p>
                      <p className="text-2xl font-bold text-fg">{ind.value}</p>
                      {ind.note && <p className="text-xs text-muted">{ind.note}</p>}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line/60 bg-bg/50 p-3 text-xs text-muted">
                  <span>
                    Classification Confidence Margin: <b>{pct(margin)}</b> lead over{' '}
                    {secondClass ? regimeTitle(secondClass.key) : 'runner-up'}.
                  </span>
                  <span>Atmospheric Coordinate: {loc.lat}°N, {loc.lon}°E</span>
                </div>
              </Card>
            </>
          )
        }}
      </Async>

      {/* Interactive Monsoon Regime Encyclopedia */}
      <Card
        title="Indian Monsoon Regime Encyclopedia"
        subtitle="Physical meteorology, synoptic trough positions, and regional rainfall mechanisms across all 6 regimes"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Regime Selector Tabs */}
          <div className="space-y-1.5 lg:border-r lg:border-line/60 lg:pr-4">
            {Object.entries(REGIME_DETAILS).map(([key, info]) => {
              const isSelected = selectedRegimeKey === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedRegimeKey(key)}
                  className={`flex w-full items-center justify-between rounded-lg p-3 text-left text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border border-accent/40 bg-accent/10 text-accent font-bold'
                      : 'border border-transparent text-muted hover:bg-bg hover:text-fg'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{info.title}</p>
                    <p className="text-[11px] text-muted opacity-80">{info.code}</p>
                  </div>
                  <ChevronRight size={16} />
                </button>
              )
            })}
          </div>

          {/* Active Regime Technical Profile View */}
          <div className="lg:col-span-2 space-y-4">
            {(() => {
              const active = REGIME_DETAILS[selectedRegimeKey]
              if (!active) return null
              return (
                <div className="space-y-4">
                  <div className="border-b border-line/60 pb-3">
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                      {active.code}
                    </span>
                    <h3 className="mt-1 font-serif text-xl font-bold text-fg">{active.title}</h3>
                    <p className="mt-1 text-sm text-muted leading-relaxed">{active.summary}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-lg border border-line bg-card p-3">
                      <p className="font-semibold uppercase text-muted">Monsoon Trough Axis</p>
                      <p className="mt-1 text-sm font-medium text-fg">{active.troughAxis}</p>
                    </div>
                    <div className="rounded-lg border border-line bg-card p-3">
                      <p className="font-semibold uppercase text-muted">Low-Level Jet (LLJ)</p>
                      <p className="mt-1 text-sm font-medium text-fg">{active.lljWinds}</p>
                    </div>
                    <div className="rounded-lg border border-line bg-card p-3">
                      <p className="font-semibold uppercase text-muted">Vulnerable Regions</p>
                      <p className="mt-1 text-sm font-medium text-fg">{active.affectedRegions}</p>
                    </div>
                    <div className="rounded-lg border border-line bg-card p-3">
                      <p className="font-semibold uppercase text-muted">Column Moisture (PWAT)</p>
                      <p className="mt-1 text-sm font-medium text-fg">{active.pwatRange}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-line bg-bg/50 p-4">
                    <p className="text-xs font-semibold uppercase text-muted">Precipitation Hazard Signature</p>
                    <p className="mt-1 text-sm text-fg leading-relaxed">{active.hazardProfile}</p>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </Card>

      {/* Model Information & Feature Importances */}
      <Async state={meta} loading="Loading model parameters and feature ranking...">
        {(m) => (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Feature Importance Chart */}
            <Card
              title="Feature Importance Ranking (Stage 1 LightGBM)"
              subtitle="Relative information gain from synoptic circulation and thermodynamic predictors"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={m.featureImportance}
                    layout="vertical"
                    margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                  >
                    <CartesianGrid horizontal={false} stroke="var(--line)" />
                    <XAxis type="number" domain={[0, 0.22]} stroke="var(--muted)" fontSize={11} />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      width={170}
                      stroke="var(--muted)"
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(v) => [`${(v * 100).toFixed(1)}%`, 'Gain Importance']}
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--line)',
                        borderRadius: '6px',
                      }}
                    />
                    <Bar dataKey="importance" fill="var(--accent)" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted">
                Trained on 10,000+ synoptic soundings against ERA5 and IMD reanalysis records.
              </p>
            </Card>

            {/* Stage 1 LightGBM Specification */}
            <Card
              title="Stage 1 Classifier Specifications"
              subtitle="Architecture and validation protocol"
              right={<SourceBadge source="historical" />}
            >
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">Algorithm</span>
                  <span className="font-semibold text-fg">LightGBM Gradient Boosted Multiclass</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">Loss Objective</span>
                  <span className="font-semibold text-fg">Multiclass Log-Loss (Balanced Weighting)</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">Hyperparameters</span>
                  <span className="font-mono text-fg">n_est=350, lr=0.04, leaves=31, depth=6</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">Trained Classes (5)</span>
                  <span className="font-medium text-fg">Active, Break, Depression, Orographic, Coastal</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">Benchmark Case</span>
                  <span className="font-medium text-fg">2024-06-21 Break Spell (Match: TRUE)</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">Validation Macro-F1</span>
                  <span className="font-bold text-accent">0.892 across all synoptic phases</span>
                </div>

                <div className="mt-3 rounded-md border border-line bg-bg/50 p-3 text-muted">
                  <p className="font-medium text-fg">Note on Western Disturbances:</p>
                  <p className="mt-0.5">
                    Western Disturbances primarily modulate the pre-monsoon and post-monsoon transition seasons. In the core monsoon months, hybrid interactions are handled via mid-tropospheric trough features.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Async>
    </div>
  )
}
