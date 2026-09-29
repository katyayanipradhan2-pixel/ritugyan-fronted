// Maps raw backend JSON -> clean frontend state models.
// UI never reads raw snake_case responses directly.
// If the FastAPI schema evolves, modify ONLY this file.

const step = (vals) => {
  const u = [...new Set(vals)].sort((a, b) => a - b)
  let m = Infinity
  for (let i = 1; i < u.length; i++) m = Math.min(m, u[i] - u[i - 1])
  return Number.isFinite(m) ? m : 1
}

export const adaptPrediction = (r, source) => ({
  source, // 'live' | 'demo'
  date: r.date ?? null,
  initTime: r.init_time ?? null,
  horizon: r.horizon ?? null,
  dataSource: r.data_source ?? null,
  modelVersion: r.model_version ?? null,
  regime: r.regime,
  confidence: r.confidence,
  classProbs: Object.entries(r.class_probabilities ?? {})
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value),
  risk: {
    moderate: r.risk?.moderate ?? +(r.risk?.heavy * 1.25 > 1 ? 0.98 : (r.risk?.heavy ?? 0.5) * 1.2).toFixed(2),
    heavy: r.risk?.heavy ?? null,
    veryHeavy: r.risk?.very_heavy ?? null,
    extreme: r.risk?.extreme ?? null,
  },
  synopticIndicators: r.synoptic_indicators ?? (r.indicators?.map(i => ({ name: i.name, value: String(i.value), note: '' })) ?? []),
  indicators: r.indicators ?? null,
  rawGfsComparison: r.raw_gfs_comparison ?? null,
})

export const adaptGrid = (r, source) => {
  const cells = (r?.grid ?? []).map((g) => ({
    lat: g.lat,
    lon: g.lon,
    value: g.rainfall_probability,
  }))
  return {
    source,
    cells,
    step: step(cells.map((c) => c.lat)),
    troughLine: r?.trough_line ?? [],
  }
}

export const adaptVerification = (r, source) => {
  if (!r?.metrics) return null
  return {
    source,
    period: r.period ?? null,
    metrics: r.metrics,
    gfsBaseline: r.gfs_baseline_metrics ?? null,
    brierScore: r.brier_score ?? null,
    reliabilityCurve: r.reliability_curve ?? [],
    thresholdSkills: r.threshold_skills ?? [],
    spatialFss: r.spatial_fss ?? [],
    confusionMatrix: r.confusion_matrix ?? null,
  }
}

export const adaptMetadata = (r, source) => ({
  source,
  model: r.model ?? null,
  featureImportance: r.feature_importance ?? [],
  datasets: r.datasets ?? [],
  locations: r.locations ?? [],
  evaluationExample: r.evaluation_example ?? null,
})
