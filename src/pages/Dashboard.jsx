import useAsync from '../hooks/useAsync'
import { useSite } from '../hooks/useSite'
import { getPrediction, getForecast } from '../services/api'
import { Async, Card, PageHeader, IMDAlertBanner } from '../components/common/common'
import {
  RegimeCard,
  ForecastSummary,
  ProbabilityChart,
  RiskCards,
  ExecutiveBriefing,
  ModelComparisonCard,
  SectorImpactCard,
} from '../components/dashboard/dashboard'
import RainfallMap, { LocationSelector } from '../components/map/RainfallMap'

export default function Dashboard() {
  const { loc, setLoc, horizon, setHorizon, caseStudy } = useSite()
  const pred = useAsync(
    () => getPrediction(loc, horizon, caseStudy),
    [loc.lat, loc.lon, horizon, caseStudy]
  )
  const grid = useAsync(() => getForecast(caseStudy), [caseStudy])

  return (
    <div className="space-y-6">
      <Async state={pred} loading="Synthesizing calibrated monsoon forecast...">
        {(p) => (
          <>
            <PageHeader
              title="Monsoon Forecast Dashboard"
              source={p.source}
              note="Two-stage regime-aware machine learning post-processor for operational NOAA GFS rainfall."
            />

            {/* IMD Color Warning Banner */}
            <IMDAlertBanner risk={p.risk} />

            {/* Executive Synthesis */}
            <ExecutiveBriefing p={p} loc={loc} />

            {/* Synoptic Regime & Forecast Summary */}
            <div className="grid gap-6 lg:grid-cols-3">
              <RegimeCard p={p} />
              <div className="lg:col-span-2">
                <ForecastSummary
                  p={p}
                  loc={loc}
                  horizon={horizon}
                  onHorizonChange={setHorizon}
                />
              </div>
            </div>
          </>
        )}
      </Async>

      {/* Spatial Map & Location Selector */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Monsoon Rainfall Probability Map"
          subtitle="Gridded exceedance probabilities with synoptic monsoon trough axis overlay"
          className="xl:col-span-2"
        >
          <Async
            state={grid}
            loading="Generating spatial rainfall probability fields..."
            emptyText="No spatial grid data available."
            isEmpty={(g) => !g.cells.length}
          >
            {(g) => <RainfallMap grid={g} loc={loc} onPick={setLoc} />}
          </Async>
        </Card>
        <LocationSelector />
      </div>

      {/* Probabilistic Classification & Exceedance Risks */}
      <Async state={pred} loading="Loading probabilistic regime distributions...">
        {(p) => (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <ProbabilityChart p={p} />
              <div>
                <RiskCards p={p} />
              </div>
            </div>

            {/* NWP Comparison & Sector Advisories */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ModelComparisonCard p={p} />
              <SectorImpactCard p={p} />
            </div>
          </>
        )}
      </Async>
    </div>
  )
}
