import * as mock from '../data/mock'
import { adaptPrediction, adaptGrid, adaptVerification, adaptMetadata } from './adapters'

const BASE = import.meta.env.VITE_API_BASE_URL
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

const later = (v, ms = 250) => new Promise((r) => setTimeout(() => r(v), ms))

async function http(path, opts) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

const today = () => new Date().toISOString().slice(0, 10)

export const getHealth = async () => {
  if (DEMO_MODE) return 'demo'
  try {
    await http('/health')
    return 'connected'
  } catch {
    return 'offline'
  }
}

// POST /predict or dynamic simulation
export const getPrediction = async ({ lat, lon }, horizon = '24h', caseId = null) => {
  if (DEMO_MODE) {
    const raw = mock.getDynamicPrediction({ lat, lon }, horizon, caseId)
    return adaptPrediction(await later(raw, 200), 'demo')
  }
  return adaptPrediction(
    await http('/predict', {
      method: 'POST',
      body: JSON.stringify({ latitude: lat, longitude: lon, date: today(), horizon }),
    }),
    'live'
  )
}

// GET /regime
export const getRegime = async (horizon = '24h') => {
  if (DEMO_MODE) {
    const raw = mock.getDynamicPrediction({ lat: 20.3, lon: 85.8 }, horizon)
    return adaptPrediction(await later(raw, 180), 'demo')
  }
  return adaptPrediction(await http('/regime'), 'live')
}

// GET /forecast -> gridded rainfall probabilities & trough line
export const getForecast = async (caseId = null) => {
  if (DEMO_MODE) {
    return adaptGrid(await later(mock.grid(caseId), 250), 'demo')
  }
  return adaptGrid(await http('/forecast'), 'live')
}

// GET /verification -> diagnostics & skill scores
export const getVerification = async () => {
  if (DEMO_MODE) {
    return adaptVerification(await later(mock.verification, 200), 'demo')
  }
  return adaptVerification(await http('/verification'), 'live')
}

// GET /metadata
export const getMetadata = async () => {
  if (DEMO_MODE) {
    return adaptMetadata(await later(mock.metadata, 120), 'demo')
  }
  return adaptMetadata(await http('/metadata'), 'live')
}

// Downloadable Executive Operational Forecast Brief
export const exportForecastReport = (prediction, loc, horizon) => {
  const content = `========================================================
RITUGYAN METEOROLOGICAL BRIEFING REPORT
Regime-Aware Post-Processed Rainfall Forecast
========================================================
Generated At: ${new Date().toISOString()}
Location: ${loc?.name ?? 'Point'} (${loc?.lat}°N, ${loc?.lon}°E)
Forecast Date: ${prediction.date}
Forecast Horizon: ${prediction.horizon ?? horizon}
Model: ${prediction.modelVersion ?? 'v2.4'} (${prediction.dataSource})
--------------------------------------------------------
SYNOPTIC REGIME ASSESSMENT:
Detected Regime: ${prediction.regime}
Model Confidence: ${(prediction.confidence * 100).toFixed(1)}%

IMD EXCEEDANCE PROBABILITIES:
≥ 15.6 mm/day (Moderate):       ${prediction.risk?.moderate ? (prediction.risk.moderate * 100).toFixed(0) + '%' : 'N/A'}
≥ 64.5 mm/day (Heavy):          ${prediction.risk?.heavy ? (prediction.risk.heavy * 100).toFixed(0) + '%' : 'N/A'}
≥ 115.6 mm/day (Very Heavy):    ${prediction.risk?.veryHeavy ? (prediction.risk.veryHeavy * 100).toFixed(0) + '%' : 'N/A'}
≥ 204.5 mm/day (Extreme):       ${prediction.risk?.extreme ? (prediction.risk.extreme * 100).toFixed(0) + '%' : 'N/A'}

RAW GFS vs RITUGYAN ML POST-PROCESSOR:
Raw GFS Rainfall:              ${prediction.rawGfsComparison?.raw_gfs_rain ?? 'N/A'} mm/day
RituGyan Calibrated:           ${prediction.rawGfsComparison?.ritugyan_calibrated_rain ?? 'N/A'} mm/day
Correction Applied:            ${prediction.rawGfsComparison?.bias_correction ?? 'N/A'}

SYNOPTIC SOUNDING INDICATORS:
${(prediction.synopticIndicators ?? []).map((i) => ` - ${i.name.padEnd(30)}: ${i.value} (${i.note ?? ''})`).join('\n')}

========================================================
CONFIDENTIAL OPERATIONAL ADVISORY - NOT FOR PUBLIC REDISTRIBUTION
========================================================`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `RituGyan_Forecast_${(loc?.name ?? 'Loc').replace(/\s+/g, '_')}_${prediction.date}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
