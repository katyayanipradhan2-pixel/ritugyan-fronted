import { Download, Sliders, Calendar, Clock, MapPin, CloudRain } from 'lucide-react'
import useAsync from '../hooks/useAsync'
import { useSite } from '../hooks/useSite'
import { getPrediction, exportForecastReport } from '../services/api'
import { Async, Card, PageHeader, IMDAlertBanner } from '../components/common/common'
import {
  ForecastSummary,
  RiskCards,
  ModelComparisonCard,
  SectorImpactCard,
  ThresholdExplorer,
} from '../components/dashboard/dashboard'
import { LocationSelector } from '../components/map/RainfallMap'
import { pct, regimeName, regimeTitle, ALL_THRESHOLDS, getImdAlert } from '../utils/format'

export default function Forecast() {
  const { loc, horizon, setHorizon, caseStudy, customThreshold, setCustomThreshold } = useSite()
  const pred = useAsync(
    () => getPrediction(loc, horizon, caseStudy),
    [loc.lat, loc.lon, horizon, caseStudy]
  )

  return (
    <Async state={pred} loading="Retrieving calibrated forecast package...">
      {(p) => {
        const alert = getImdAlert(p.risk)
        return (
          <div className="space-y-6">
            <PageHeader
              title="Operational Monsoon Forecast & Directives"
              source={p.source}
              note="Multi-horizon regime-conditioned precipitation forecast, Doppler rain categories, and multi-sector directives."
              actions={
                <button
                  onClick={() => exportForecastReport(p, loc, horizon)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Download size={14} /> Download Official Brief
                </button>
              }
            />

            {/* IMD Alert Banner */}
            <IMDAlertBanner risk={p.risk} />

            {/* Horizon & Station Summary */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ForecastSummary
                  p={p}
                  loc={loc}
                  horizon={horizon}
                  onHorizonChange={setHorizon}
                />
              </div>
              <LocationSelector />
            </div>

            {/* Comprehensive IMD Categorical Threshold Matrix with Rain Colors */}
            <Card
              title="Monsoon Rainfall Category Exceedance Matrix"
              subtitle="Probabilistic evaluation across IMD rainfall categories with Doppler radar color-coding"
              className="monsoon-card-glow"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs font-semibold uppercase text-muted">
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Threshold</th>
                      <th className="pb-3">Exceedance Probability</th>
                      <th className="pb-3">IMD Alert Level</th>
                      <th className="pb-3">Operational Directive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {ALL_THRESHOLDS.map((t) => {
                      const prob = p.risk[t.key]
                      const isHigh = prob != null && prob >= 0.5
                      const isMod = prob != null && prob >= 0.25 && prob < 0.5
                      return (
                        <tr key={t.key} className="hover:bg-bg/40 transition-colors">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                                style={{ backgroundColor: t.color }}
                              />
                              <div>
                                <p className="font-semibold text-fg">{t.label}</p>
                                <p className="text-[11px] text-muted">{t.hindi}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 font-mono text-xs font-medium text-muted">
                            ≥ {t.mm} mm/day
                          </td>
                          <td className="py-3.5 font-bold">
                            <div className="flex items-center gap-2.5">
                              <span style={{ color: t.color }} className="text-base">
                                {pct(prob, 0)}
                              </span>
                              <div className="h-2 w-20 rounded-full bg-line overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${(prob ?? 0) * 100}%`,
                                    backgroundColor: t.color,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span
                              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                              style={{
                                backgroundColor: `${t.color}15`,
                                color: t.color,
                              }}
                            >
                              {isHigh ? 'High Risk' : isMod ? 'Moderate' : 'Low Likelihood'}
                            </span>
                          </td>
                          <td className="py-3.5 text-xs text-muted">
                            {isHigh
                              ? 'Active Flood Mitigation Recommended'
                              : isMod
                              ? 'Vigilance & Drainage Clearance'
                              : 'Standard Seasonal Precautions'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Interactive Threshold Exceedance Explorer */}
            <ThresholdExplorer
              p={p}
              threshold={customThreshold}
              onThresholdChange={setCustomThreshold}
            />

            {/* NWP Raw GFS vs Calibrated RituGyan Comparison */}
            <ModelComparisonCard p={p} />

            {/* Multi-Sector Operational Impact Advisories */}
            <SectorImpactCard p={p} />
          </div>
        )
      }}
    </Async>
  )
}
