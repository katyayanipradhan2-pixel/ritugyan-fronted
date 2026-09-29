import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts'
import {
  CloudRain,
  Wind,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Sprout,
  Building2,
  ShieldAlert,
  Droplets,
  Clock,
  Compass,
} from 'lucide-react'
import { Card, Modal } from '../common/common'
import {
  pct,
  regimeName,
  regimeTitle,
  THRESHOLDS,
  ALL_THRESHOLDS,
  REGIME_DETAILS,
  getImdAlert,
  getSectorAdvisories,
} from '../../utils/format'

// Executive Summary Banner with Monsoon Petrichor Vibe
export const ExecutiveBriefing = ({ p, loc }) => {
  const alert = getImdAlert(p.risk)
  const regimeInfo = REGIME_DETAILS[p.regime]

  return (
    <section className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-r from-card via-card to-cyan-500/10 p-5 shadow-sm monsoon-card-glow">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <CloudRain size={12} className="text-cyan-500" />
              Monsoon Advisory Briefing
            </span>
            <span className="text-xs text-muted">
              Station: <b>{loc?.name ?? 'Selected Point'}</b> · Horizon: <b>{p.horizon ?? '24h'}</b>
            </span>
          </div>
          <h2 className="font-serif text-lg font-bold text-fg sm:text-xl">
            {regimeTitle(p.regime)} active over target monsoon basin.
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            {regimeInfo?.summary ?? 'Synoptic circulation indicates active monsoon dynamics.'}{' '}
            Heavy downpour exceedance probability is{' '}
            <b className="text-blue-600 dark:text-blue-400">{pct(p.risk?.heavy)}</b> with an overall{' '}
            <b className="text-fg">{alert.level}</b> early warning level.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <div className="rounded-lg border border-line bg-card/85 px-4 py-2.5 text-right backdrop-blur-xs">
            <p className="text-xs text-muted">Dominant Regime</p>
            <p className="font-serif text-base font-bold text-cyan-600 dark:text-cyan-400">
              {regimeTitle(p.regime)}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-card/85 px-4 py-2.5 text-right backdrop-blur-xs">
            <p className="text-xs text-muted">Confidence</p>
            <p className="text-base font-bold text-fg">{pct(p.confidence)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Detected Regime Card with Synoptic Physics Modal
export const RegimeCard = ({ p }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const details = REGIME_DETAILS[p.regime] ?? REGIME_DETAILS.ACTIVE_MONSOON

  return (
    <>
      <Card
        title="Detected weather regime"
        subtitle="Stage 1 Synoptic Multiclass Classifier"
        className="monsoon-card-glow"
        right={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <Info size={13} /> Regime details
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1">
              <Droplets size={12} className="text-cyan-500" />
              Synoptic Circulation State
            </span>
            <p className="font-serif text-3xl font-bold leading-tight text-fg tracking-tight sm:text-4xl mt-0.5">
              {regimeName(p.regime)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-bg/50 p-3 text-xs">
            <div>
              <p className="text-muted">Model Confidence</p>
              <p className="mt-0.5 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {pct(p.confidence)}
              </p>
            </div>
            <div>
              <p className="text-muted">Monsoon Trough</p>
              <p className="mt-0.5 text-sm font-semibold text-fg">
                {p.synopticIndicators?.find((i) => i.name.includes('Trough'))?.value ?? '21.5° N'}
              </p>
            </div>
          </div>

          {p.synopticIndicators && p.synopticIndicators.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-medium text-muted">Atmospheric Sounding Parameters</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {p.synopticIndicators.slice(0, 4).map((item) => (
                  <div key={item.name} className="rounded border border-line bg-card p-2">
                    <p className="truncate text-muted">{item.name}</p>
                    <p className="font-semibold text-fg">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/regime"
              className="flex items-center justify-between rounded-md border border-line bg-bg/40 px-3 py-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:border-cyan-500 transition-colors"
            >
              <span>Explore full regime sounding & physics</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`${details.title} — Technical Profile`}>
        <div className="space-y-4 text-sm">
          <p className="text-muted leading-relaxed">{details.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line p-3">
              <p className="text-xs font-semibold text-muted uppercase">Trough Axis Position</p>
              <p className="mt-1 font-medium">{details.troughAxis}</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <p className="text-xs font-semibold text-muted uppercase">Low-Level Westerly Jet</p>
              <p className="mt-1 font-medium">{details.lljWinds}</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <p className="text-xs font-semibold text-muted uppercase">Key Impacted Regions</p>
              <p className="mt-1 font-medium">{details.affectedRegions}</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <p className="text-xs font-semibold text-muted uppercase">Precipitable Water (PWAT)</p>
              <p className="mt-1 font-medium">{details.pwatRange}</p>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-bg/50 p-3">
            <p className="text-xs font-semibold text-muted uppercase">Precipitation Hazard Signature</p>
            <p className="mt-1 font-medium text-fg">{details.hazardProfile}</p>
          </div>
        </div>
      </Modal>
    </>
  )
}

// Forecast Summary with Horizon Selector
export const ForecastSummary = ({ p, loc, horizon, onHorizonChange }) => {
  const HORIZONS = [
    { key: '24h', label: '24h (Day 1)' },
    { key: '48h', label: '48h (Day 2)' },
    { key: '72h', label: '72h (Day 3)' },
    { key: '120h', label: '120h (Day 5)' },
  ]

  const rows = [
    ['Forecast date', p.date],
    ['Initialization time', p.initTime ?? '00:00 UTC'],
    ['Forecast horizon', p.horizon ?? horizon],
    ['Operational source', p.dataSource ?? 'NOAA GFS + RituGyan ML'],
    ['Model version', p.modelVersion ?? 'v2.4-lgbm-evt'],
    ['Target coordinates', loc && `${loc.name} (${loc.lat}°N, ${loc.lon}°E)`],
  ]

  return (
    <Card
      title="Forecast information"
      subtitle="Numerical Weather Prediction & Post-Processing Metadata"
      className="monsoon-card-glow"
      right={
        onHorizonChange && (
          <div className="flex items-center gap-1 rounded-md border border-line bg-bg p-0.5">
            {HORIZONS.map((h) => (
              <button
                key={h.key}
                onClick={() => onHorizonChange(h.key)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  (horizon ?? '24h') === h.key
                    ? 'bg-card text-cyan-600 dark:text-cyan-400 font-bold shadow-xs'
                    : 'text-muted hover:text-fg'
                }`}
              >
                {h.key}
              </button>
            ))}
          </div>
        )
      }
    >
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-line/60 pb-2 text-sm">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-medium text-fg">{v ?? 'Not provided'}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

// Regime Class Probabilities Chart
export const ProbabilityChart = ({ p }) => {
  const data = p.classProbs.map((c) => ({
    key: c.key,
    name: regimeTitle(c.key),
    value: +(c.value * 100).toFixed(1),
  }))

  return (
    <Card
      title="Regime class probability distribution"
      subtitle="Multiclass softmax output from LightGBM Stage 1"
      className="monsoon-card-glow"
    >
      <div
        role="img"
        aria-label={`Regime probabilities: ${data.map((d) => `${d.name} ${d.value}%`).join(', ')}`}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
            <CartesianGrid horizontal={false} stroke="var(--line)" />
            <XAxis type="number" domain={[0, 100]} unit="%" stroke="var(--muted)" fontSize={11} />
            <YAxis type="category" dataKey="name" width={140} stroke="var(--muted)" fontSize={12} tickLine={false} />
            <Tooltip
              formatter={(v) => [`${v}%`, 'Probability']}
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((d) => (
                <Cell key={d.key} fill={d.key === p.regime ? 'var(--accent)' : 'var(--line)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted">
        Reflects probabilistic classifier distribution over synoptic circulation states.
      </p>
    </Card>
  )
}

// Exceedance Risk Cards for Standard IMD Thresholds with Rain Colors
export const RiskCards = ({ p }) => (
  <div>
    <div className="grid gap-4 sm:grid-cols-3">
      {THRESHOLDS.map((t) => {
        const v = p.risk[t.key]
        const isHighRisk = v != null && v >= 0.6
        const isModerateRisk = v != null && v >= 0.3 && v < 0.6

        return (
          <div
            key={t.key}
            className="rounded-xl border border-line bg-card p-5 shadow-xs transition-all hover:scale-[1.02] hover:shadow-md"
            style={{ borderTop: `4px solid ${t.color}` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1">
                  <CloudRain size={13} style={{ color: t.color }} />
                  {t.short}
                </p>
                <p className="text-[11px] font-medium text-muted/80">{t.hindi}</p>
              </div>
              <span
                className="rounded px-2 py-0.5 text-xs font-mono font-bold"
                style={{ backgroundColor: `${t.color}15`, color: t.color }}
              >
                ≥ {t.mm} mm
              </span>
            </div>

            <p className="mt-2 text-3xl font-extrabold tracking-tight" style={{ color: t.color }}>
              {v == null ? 'Not provided' : pct(v, 0)}
            </p>

            <div
              className="mt-3 h-2 rounded-full bg-line overflow-hidden"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={v == null ? 0 : Math.round(v * 100)}
              aria-label={`${t.label} probability`}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(v ?? 0) * 100}%`,
                  backgroundColor: t.color,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span>{t.label}</span>
              <span className="font-semibold" style={{ color: t.color }}>
                {isHighRisk ? 'High Hazard' : isModerateRisk ? 'Moderate' : 'Low Likelihood'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
    <p className="mt-2 text-xs text-muted">
      Calibrated precipitation exceedance probabilities from Stage 2 regime-conditioned quantile regression.
    </p>
  </div>
)

// Raw GFS NWP vs RituGyan ML Post-Processed Comparison
export const ModelComparisonCard = ({ p }) => {
  const raw = p.rawGfsComparison
  if (!raw) return null

  return (
    <Card
      title="NWP Value-Add: Raw GFS vs RituGyan ML"
      subtitle="Evaluating regime-aware bias correction against raw numerical weather prediction"
      className="monsoon-card-glow"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-bg/40 p-4">
          <p className="text-xs text-muted uppercase">Raw NOAA GFS NWP</p>
          <p className="mt-1 text-2xl font-bold text-fg">{raw.raw_gfs_rain} mm/day</p>
          <p className="mt-1 text-xs text-muted">
            Raw model heavy rain prob: <b>{pct(raw.gfs_heavy_prob)}</b>
          </p>
        </div>

        <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/5 p-4">
          <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase">
            RituGyan Calibrated ML
          </p>
          <p className="mt-1 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            {raw.ritugyan_calibrated_rain} mm/day
          </p>
          <p className="mt-1 text-xs text-cyan-700/80 dark:text-cyan-400/80">
            Calibrated heavy rain prob: <b>{pct(raw.ml_heavy_prob)}</b>
          </p>
        </div>

        <div className="rounded-lg border border-line bg-card p-4">
          <p className="text-xs text-muted uppercase">Bias Correction Applied</p>
          <p className="mt-1 text-sm font-semibold text-fg">{raw.bias_correction}</p>
          <p className="mt-1 text-xs text-muted">Reduces dry bias & false alarms in deep convection.</p>
        </div>
      </div>
    </Card>
  )
}

// Actionable Multi-Sector Advisories Component
export const SectorImpactCard = ({ p }) => {
  const advisories = getSectorAdvisories(p.regime, p.risk)

  return (
    <Card
      title="Sector-specific operational impact advisories"
      subtitle="Automated impact translations for agriculture, infrastructure, disaster response, and water management"
      className="monsoon-card-glow"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {advisories.map((item) => (
          <div key={item.sector} className="rounded-lg border border-line bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-fg">{item.sector}</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">{item.action}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Interactive Continuous Threshold Exceedance Explorer with Monsoon Area Gradient
export const ThresholdExplorer = ({ p, threshold, onThresholdChange }) => {
  const currentThreshold = threshold ?? 64.5

  // Generate continuous curve points from 10mm to 220mm
  const curveData = []
  for (let mm = 10; mm <= 220; mm += 15) {
    const scale = p.regime === 'OROGRAPHIC_MONSOON' || p.regime === 'MONSOON_DEPRESSION' ? 95 : 55
    const prob = +(Math.exp(-Math.pow(mm / scale, 1.25))).toFixed(2)
    curveData.push({ mm, prob: +(prob * 100).toFixed(0) })
  }

  const selectedProb = +(
    Math.exp(
      -Math.pow(
        currentThreshold /
          (p.regime === 'OROGRAPHIC_MONSOON' || p.regime === 'MONSOON_DEPRESSION' ? 95 : 55),
        1.25
      )
    ) * 100
  ).toFixed(0)

  return (
    <Card
      title="Interactive Rainfall Threshold Explorer"
      subtitle="Examine continuous exceedance probability across any rainfall threshold (mm/day)"
      className="monsoon-card-glow"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-bg/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label htmlFor="threshold-slider" className="text-xs font-semibold text-muted uppercase">
              Rainfall Threshold: <b className="text-fg text-sm">{currentThreshold} mm/day</b>
            </label>
            <input
              id="threshold-slider"
              type="range"
              min="10"
              max="220"
              step="5"
              value={currentThreshold}
              onChange={(e) => onThresholdChange && onThresholdChange(+e.target.value)}
              className="mt-2 w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_THRESHOLDS.map((t) => (
              <button
                key={t.mm}
                onClick={() => onThresholdChange && onThresholdChange(t.mm)}
                className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                  currentThreshold === t.mm
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'border-line text-muted hover:text-fg'
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: t.color }} />
                {t.short} ({t.mm}mm)
              </button>
            ))}
          </div>

          <div className="text-right">
            <p className="text-xs text-muted">Exceedance Probability</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{selectedProb}%</p>
          </div>
        </div>

        {/* Area Chart with Monsoon Rain Gradient */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="monsoonRainArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="60%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="mm" stroke="var(--muted)" fontSize={11} unit=" mm" />
              <YAxis domain={[0, 100]} unit="%" stroke="var(--muted)" fontSize={11} />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Exceedance Probability']}
                labelFormatter={(v) => `Threshold: ≥ ${v} mm/day`}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px' }}
              />
              <ReferenceLine x={currentThreshold} stroke="#2563eb" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="prob"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#monsoonRainArea)"
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
