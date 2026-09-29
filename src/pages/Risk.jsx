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
  LineChart,
  Line,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts'
import { AlertTriangle, Droplets, ShieldAlert, ArrowDown, Activity, Info, CloudRain } from 'lucide-react'
import useAsync from '../hooks/useAsync'
import { useSite } from '../hooks/useSite'
import { getPrediction } from '../services/api'
import { Async, Card, PageHeader, IMDAlertBanner } from '../components/common/common'
import { RiskCards, ThresholdExplorer } from '../components/dashboard/dashboard'
import { ALL_THRESHOLDS, pct, getImdAlert } from '../utils/format'

export default function Risk() {
  const { loc, horizon, caseStudy, customThreshold, setCustomThreshold } = useSite()
  const pred = useAsync(
    () => getPrediction(loc, horizon, caseStudy),
    [loc.lat, loc.lon, horizon, caseStudy]
  )

  return (
    <Async state={pred} loading="Calculating rainfall exceedance probabilities...">
      {(p) => {
        const data = ALL_THRESHOLDS.map((t) => ({
          name: t.short,
          mmLabel: `≥ ${t.mm} mm`,
          mm: t.mm,
          color: t.color,
          hindi: t.hindi,
          value: p.risk[t.key] == null ? 0 : +(p.risk[t.key] * 100).toFixed(0),
        }))

        // Return period estimates (empirical hydrology fitting)
        const returnPeriods = [
          { threshold: '≥ 64.5 mm (Heavy Rain)', color: '#2563eb', returnPeriod: 'Annual (~1-in-1 Year)', runoffRisk: 'Moderate urban runoff; localized ponding' },
          { threshold: '≥ 115.6 mm (Very Heavy)', color: '#7c3aed', returnPeriod: '1-in-3 to 1-in-5 Year', runoffRisk: 'Severe street flooding; culvert choke risk' },
          { threshold: '≥ 204.5 mm (Cloudburst Deluge)', color: '#e11d48', returnPeriod: '1-in-10 to 1-in-25 Year', runoffRisk: 'Catastrophic river surge; widespread inundation' },
        ]

        return (
          <div className="space-y-6">
            <PageHeader
              title="Rainfall Risk & Hazard Assessment"
              source={p.source}
              note="Stage 2 regime-conditioned quantile regression and Extreme Value Theory (EVT) tail modeling for the Indian Monsoon."
            />

            {/* IMD Alert Banner */}
            <IMDAlertBanner risk={p.risk} />

            {/* Standard Category Risk Cards */}
            <RiskCards p={p} />

            {/* Exceedance Probability by Standard Categories */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card
                title="Exceedance Probability by Monsoon Rain Threshold"
                subtitle="Calibrated likelihood of exceeding daily rainfall thresholds (color-coded Doppler scale)"
                className="monsoon-card-glow"
              >
                <div
                  role="img"
                  aria-label={data.map((d) => `${d.name}: ${d.value}%`).join(', ')}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid vertical={false} stroke="var(--line)" />
                      <XAxis dataKey="mmLabel" stroke="var(--muted)" fontSize={11} />
                      <YAxis domain={[0, 100]} unit="%" stroke="var(--muted)" fontSize={11} />
                      <Tooltip
                        formatter={(v, name, item) => [`${v}% (${item.payload.hindi})`, 'Probability']}
                        contentStyle={{
                          background: 'var(--card)',
                          border: '1px solid var(--line)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                        {data.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Hydrological Impact & Return Periods */}
              <Card
                title="Hydrological Hazard Return Periods"
                subtitle="Statistical recurrence frequency and catchment runoff potential"
                className="monsoon-card-glow"
              >
                <div className="space-y-3">
                  {returnPeriods.map((item) => (
                    <div
                      key={item.threshold}
                      className="rounded-lg border border-line bg-card p-3.5 space-y-1 text-xs"
                      style={{ borderLeft: `4px solid ${item.color}` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-fg flex items-center gap-1.5">
                          <CloudRain size={13} style={{ color: item.color }} />
                          {item.threshold}
                        </span>
                        <span
                          className="rounded px-2 py-0.5 font-bold text-[11px]"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          {item.returnPeriod}
                        </span>
                      </div>
                      <p className="text-muted leading-relaxed">{item.runoffRisk}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Interactive Continuous Threshold Exceedance Explorer */}
            <ThresholdExplorer
              p={p}
              threshold={customThreshold}
              onThresholdChange={setCustomThreshold}
            />

            {/* Extreme Value Theory (EVT) Deep Dive Note */}
            <Card
              title="Extreme Value Theory (EVT) Formulation"
              subtitle="Why Generalized Pareto Distributions (GPD) are vital for monsoon flood risk"
              className="monsoon-card-glow"
            >
              <div className="grid gap-4 md:grid-cols-2 text-xs leading-relaxed text-muted">
                <div className="rounded-lg border border-line bg-bg/50 p-4 space-y-2">
                  <p className="font-semibold text-fg text-sm flex items-center gap-1.5">
                    <Droplets size={15} className="text-cyan-500" />
                    The Heavy Convective Tail Problem
                  </p>
                  <p>
                    Standard numerical models and naive machine learning regressors assume Gaussian or Gamma distributions. This causes severe under-prediction of extreme convective cloudbursts (&gt; 150 mm/day) because the probability density decays exponentially.
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-bg/50 p-4 space-y-2">
                  <p className="font-semibold text-fg text-sm flex items-center gap-1.5">
                    <CloudRain size={15} className="text-purple-500" />
                    Peaks-Over-Threshold (POT) Calibration
                  </p>
                  <p>
                    RituGyan Stage 2 models the extreme tail beyond the 95th percentile using a Generalized Pareto Distribution: <code className="font-mono text-cyan-600 dark:text-cyan-400">G(y) = 1 - (1 + ξ y / σ)^(-1/ξ)</code>. This provides mathematically sound exceedance bounds for emergency dam operations and flood warning.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )
      }}
    </Async>
  )
}
