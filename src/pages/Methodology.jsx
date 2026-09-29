import { useState } from 'react'
import {
  ArrowDown,
  Layers,
  Cpu,
  Database,
  Sliders,
  CheckCircle,
  FileCode,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import useAsync from '../hooks/useAsync'
import { getMetadata } from '../services/api'
import { Async, Card, PageHeader } from '../components/common/common'

const PIPELINE_STAGES = [
  {
    id: 'ingestion',
    title: '1. Numerical NWP Ingestion',
    summary: 'Automated retrieval and parsing of 6-hourly NOAA GFS 0.25° GRIB2 operational forecast runs.',
    details: {
      inputs: 'GFS 0.25° (U, V winds, Geopotential Height, Temperature, Specific Humidity, MSLP, Total Precipitable Water, CAPE).',
      processing: 'Interpolation to standard isobaric levels (850, 700, 500, 200 hPa); calculation of synoptic gradients.',
      output: 'High-dimensional atmospheric state tensor at t=0, +24h, +48h, +72h, +120h.',
    },
  },
  {
    id: 'features',
    title: '2. Synoptic Feature Engineering',
    summary: 'Domain-specific meteorological feature extraction capturing monsoon dynamics across India.',
    details: {
      inputs: 'Atmospheric state fields over domain 6°N–38°N, 66°E–100°E.',
      processing: 'Monsoon trough axis detection (meridional pressure minimum), 850 hPa Somali low-level jet core speed, 850-200 hPa thermal wind shear, relative vorticity (curl of V850), moisture flux divergence.',
      output: 'Tabular feature vector per grid point and regional synoptic domain.',
    },
  },
  {
    id: 'stage1',
    title: '3. Stage 1: Multiclass Regime Classifier',
    summary: 'LightGBM model classifies large-scale circulation into 5 distinct Indian Monsoon Regimes.',
    details: {
      inputs: 'Top 10 synoptic circulation predictors.',
      processing: 'Gradient boosted decision trees with multiclass cross-entropy loss and class-frequency inverse weighting. Evaluates softmax probabilities P(M_k | x).',
      output: 'Calibrated regime posterior probabilities for Active, Break, Depression, Orographic, and Coastal states.',
    },
  },
  {
    id: 'stage2',
    title: '4. Stage 2: Regime-Conditioned Quantile Post-Processor',
    summary: 'Quantile regression gradient boosting coupled with Extreme Value Theory (EVT) tail extrapolation.',
    details: {
      inputs: 'Raw GFS precipitation, local terrain topography (SRTM), and Stage 1 regime probabilities.',
      processing: 'Minimizes pinball loss across 19 quantiles (τ ∈ [0.05, 0.95]). Beyond the 95th percentile, a Generalized Pareto Distribution (GPD) fits the heavy convective precipitation tail.',
      output: 'Continuous cumulative distribution function F(r | x) and calibrated exceedance probabilities P(R ≥ 64.5mm).',
    },
  },
  {
    id: 'alerts',
    title: '5. Decision Support & Impact Directives',
    summary: 'Automated synthesis into IMD color-coded advisories and sector-specific action protocols.',
    details: {
      inputs: 'Calibrated exceedance probabilities across 15.6, 64.5, 115.6, 204.5 mm/day thresholds.',
      processing: 'Rule-based mapping into IMD Warning Levels (Red, Orange, Yellow, Green) and domain directives for agriculture, drainage, and dam operations.',
      output: 'Operational JSON payload, interactive web portal views, and downloadable briefs.',
    },
  },
]

const SYNOPTIC_FEATURES = [
  { name: 'Monsoon Trough Latitude (°N)', level: 'Surface / 850 hPa', role: 'Delineates Active (central) vs Break (foothills) monsoon spell.' },
  { name: '850 hPa Zonal Wind (U850)', level: '850 hPa (~1.5 km)', role: 'Low-Level Somali Jet strength impinging the Western Ghats.' },
  { name: 'Total Precipitable Water (PWAT)', level: 'Surface to Top', role: 'Total column moisture saturation available for convective release.' },
  { name: '850 hPa Relative Vorticity', level: '850 hPa', role: 'Measures cyclonic spin indicative of Monsoon Depressions.' },
  { name: 'MSLP North-South Gradient', level: 'Mean Sea Level', role: 'Drives peninsular cross-equatorial pressure push.' },
  { name: '500 hPa Geopotential Height Anomaly', level: '500 hPa (~5.5 km)', role: 'Identifies extratropical Western Disturbance upper-level troughs.' },
  { name: '200 hPa Tropical Easterly Jet (TEJ)', level: '200 hPa (~12 km)', role: 'Upper-tropospheric easterly outflow associated with Tibetan High.' },
]

export default function Methodology() {
  const meta = useAsync(getMetadata, [])
  const [activeStage, setActiveStage] = useState(PIPELINE_STAGES[2])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technical Methodology & Model Architecture"
        note="End-to-end mathematical specifications of the RituGyan two-stage regime-aware precipitation post-processing system."
      />

      {/* Interactive Pipeline Architecture Flow */}
      <Card
        title="Two-Stage Regime-Conditioned Architecture Pipeline"
        subtitle="Click any processing stage below to inspect mathematical formulations and data transformations"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stage list buttons */}
          <div className="space-y-2">
            {PIPELINE_STAGES.map((s, idx) => {
              const isSelected = activeStage.id === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStage(s)}
                  className={`w-full rounded-lg p-3 text-left transition-all ${
                    isSelected
                      ? 'border border-accent bg-accent/10 shadow-xs'
                      : 'border border-line bg-card hover:bg-bg'
                  }`}
                >
                  <p className="font-semibold text-xs text-fg">{s.title}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted">{s.summary}</p>
                </button>
              )
            })}
          </div>

          {/* Active Stage Technical Specification Detail View */}
          <div className="lg:col-span-2 rounded-lg border border-line bg-bg/40 p-5 space-y-4">
            <div>
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                Stage Specification
              </span>
              <h3 className="mt-1 font-serif text-lg font-bold text-fg">{activeStage.title}</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">{activeStage.summary}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-md border border-line bg-card p-3">
                <p className="font-semibold uppercase text-muted">Input Features & Tensors</p>
                <p className="mt-1 text-fg">{activeStage.details.inputs}</p>
              </div>

              <div className="rounded-md border border-line bg-card p-3">
                <p className="font-semibold uppercase text-muted">Mathematical Execution & Algorithms</p>
                <p className="mt-1 text-fg leading-relaxed">{activeStage.details.processing}</p>
              </div>

              <div className="rounded-md border border-line bg-card p-3">
                <p className="font-semibold uppercase text-muted">Stage Output</p>
                <p className="mt-1 font-medium text-accent">{activeStage.details.output}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Mathematical Formulations Deep-Dive */}
      <Card
        title="Core Mathematical Formulations"
        subtitle="Regime mixture modeling, quantile regression, and Extreme Value Theory"
      >
        <div className="grid gap-6 md:grid-cols-3 text-xs">
          <div className="rounded-lg border border-line bg-card p-4 space-y-2">
            <p className="font-semibold text-sm text-fg">1. Mixture Law of Regimes</p>
            <p className="text-muted leading-relaxed">
              Exceedance probability for rainfall threshold <span className="font-mono">r</span> is formulated as the total probability across all <span className="font-mono">K</span> regimes:
            </p>
            <div className="rounded bg-bg p-2 font-mono text-[11px] text-accent">
              P(R ≥ r | x) = ∑ P(M_k | x) · P(R ≥ r | x, M_k)
            </div>
            <p className="text-muted">
              Where P(M_k | x) is the Stage 1 LightGBM posterior, and P(R ≥ r | x, M_k) is the regime-conditioned quantile model.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-card p-4 space-y-2">
            <p className="font-semibold text-sm text-fg">2. Quantile Pinball Loss</p>
            <p className="text-muted leading-relaxed">
              Quantile regressors optimize the asymmetric check function for target quantile <span className="font-mono">τ ∈ (0, 1)</span>:
            </p>
            <div className="rounded bg-bg p-2 font-mono text-[11px] text-accent">
              L_τ(y, ŷ) = max(τ(y - ŷ), (1 - τ)(ŷ - y))
            </div>
            <p className="text-muted">
              Trained across 19 quantiles to reconstruct the non-parametric cumulative distribution without Gaussian assumptions.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-card p-4 space-y-2">
            <p className="font-semibold text-sm text-fg">3. Peaks-Over-Threshold (POT) EVT</p>
            <p className="text-muted leading-relaxed">
              For rainfall excesses above threshold <span className="font-mono">u</span> (95th percentile), tail probability follows Generalized Pareto:
            </p>
            <div className="rounded bg-bg p-2 font-mono text-[11px] text-accent">
              G(y) = 1 - (1 + ξ · y / σ)^(-1/ξ)
            </div>
            <p className="text-muted">
              Captures heavy power-law tails of extreme convective cloudbursts where standard NWP underestimates by 40-70%.
            </p>
          </div>
        </div>
      </Card>

      {/* Synoptic Domain Feature Engineering Table */}
      <Card
        title="Synoptic Feature Engineering Catalog"
        subtitle="Meteorological predictors derived from numerical atmospheric circulation fields"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line uppercase text-muted">
                <th className="pb-2.5">Feature Name</th>
                <th className="pb-2.5">Pressure Level</th>
                <th className="pb-2.5">Physical Meteorological Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {SYNOPTIC_FEATURES.map((f) => (
                <tr key={f.name} className="hover:bg-bg/40">
                  <td className="py-2.5 font-semibold text-fg">{f.name}</td>
                  <td className="py-2.5 font-mono text-muted">{f.level}</td>
                  <td className="py-2.5 text-muted">{f.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Operational & Research Datasets Lineage */}
      <Async state={meta} loading="Loading data lineage specifications...">
        {({ datasets }) => (
          <Card
            title="Data Lineage & Observation Infrastructure"
            subtitle="Operational feeds, ground truth verification datasets, and spatial reanalyses"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line uppercase text-muted">
                    <th className="pb-2.5">Dataset</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Spatial Resolution</th>
                    <th className="pb-2.5">Temporal Cadence</th>
                    <th className="pb-2.5">Latency / Refresh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {datasets.map((d) => (
                    <tr key={d.name} className="hover:bg-bg/40">
                      <td className="py-2.5 font-semibold text-fg">{d.name}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded px-2 py-0.5 font-bold uppercase text-[10px] ${
                            d.role === 'operational'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          }`}
                        >
                          {d.role}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-muted">{d.resolution ?? '0.25°'}</td>
                      <td className="py-2.5 text-muted">{d.interval ?? 'Daily'}</td>
                      <td className="py-2.5 text-muted">{d.latency ?? 'Standard'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </Async>
    </div>
  )
}
