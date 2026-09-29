// Scientific mock simulation engine for RituGyan.
// Simulates physically consistent meteorological regimes, synoptic soundings,
// gridded precipitation fields, verification curves, and historical benchmark cases.

// Standard static prediction for fallback
export const prediction = {
  date: '2024-06-21',
  init_time: '2024-06-21 00:00 UTC',
  horizon: '24h (Day 1)',
  data_source: 'NOAA GFS 0.25° NWP + RituGyan ML Post-Processor',
  model_version: 'v2.4-regime-lgbm',
  regime: 'BREAK_MONSOON',
  confidence: 0.946,
  class_probabilities: {
    ACTIVE_MONSOON: 0.006,
    BREAK_MONSOON: 0.946,
    MONSOON_DEPRESSION: 0.012,
    OROGRAPHIC_MONSOON: 0.03,
    COASTAL_REGIME: 0.006,
  },
  risk: { heavy: 0.78, very_heavy: 0.31, extreme: 0.07 },
  synoptic_indicators: [
    { name: 'Monsoon Trough Axis Lat', value: '27.4° N', note: 'Shifted north to foothills (> 26°N)' },
    { name: '850 hPa Zonal LLJ', value: '8.4 m/s', note: 'Weakened peninsular westerly jet' },
    { name: 'Precipitable Water (PWAT)', value: '62.5 kg/m²', note: 'Concentrated in Sub-Himalayan band' },
    { name: 'MSLP Pressure Gradient', value: '1.8 hPa', note: 'Relaxed north-south gradient' },
    { name: '850 hPa Relative Vorticity', value: '+1.4 × 10⁻⁵ s⁻¹', note: 'Weak cyclonic vorticity' },
    { name: 'Convective CAPE', value: '1,850 J/kg', note: 'Moderate foothill convective potential' },
  ],
  raw_gfs_comparison: {
    raw_gfs_rain: 42.1,
    ritugyan_calibrated_rain: 78.4,
    bias_correction: '+36.3 mm/day under-prediction corrected',
    gfs_heavy_prob: 0.44,
    ml_heavy_prob: 0.78,
  },
  indicators: [
    { name: '850 hPa U-wind (m/s)', value: 8.4 },
    { name: 'Trough Axis Lat (°N)', value: 27.4 },
    { name: 'PWAT (kg/m²)', value: 62.5 },
    { name: 'MSLP Gradient (hPa)', value: 1.8 },
  ],
}

// 4 Major Historical Benchmark Case Studies
export const BENCHMARK_CASES = {
  case_break_2024: {
    id: 'case_break_2024',
    name: 'June 2024: Extended Break Monsoon Spell',
    date: '2024-06-21',
    regime: 'BREAK_MONSOON',
    confidence: 0.946,
    loc: { name: 'Guwahati (Foothills)', lat: 26.14, lon: 91.74 },
    summary: 'Monsoon trough shifted abruptly north to Himalayan foothills. Torrential flooding in Assam and Sub-Himalayan Bengal, while core agricultural zones in MP and Maharashtra suffered acute dry spells.',
    risk: { heavy: 0.88, very_heavy: 0.54, extreme: 0.22 },
    class_probabilities: {
      ACTIVE_MONSOON: 0.006,
      BREAK_MONSOON: 0.946,
      MONSOON_DEPRESSION: 0.012,
      OROGRAPHIC_MONSOON: 0.030,
      COASTAL_REGIME: 0.006,
    },
    trough_lat: 27.8,
    indicators: [
      { name: 'Monsoon Trough Axis Lat', value: '27.8° N', note: 'Foot-hill locked' },
      { name: '850 hPa Zonal LLJ', value: '7.8 m/s', note: 'Subdued peninsular flow' },
      { name: 'Precipitable Water (PWAT)', value: '64.2 kg/m²', note: 'High northeastern moisture' },
      { name: 'MSLP Gradient', value: '1.6 hPa', note: 'Weak synoptic gradient' },
      { name: '850 hPa Vorticity', value: '+1.1 × 10⁻⁵ s⁻¹', note: 'Suppressed central vorticity' },
      { name: 'CAPE', value: '2,100 J/kg', note: 'Localized deep convection' },
    ],
  },
  case_depression_2023: {
    id: 'case_depression_2023',
    name: 'July 2023: Bay of Bengal Monsoon Depression',
    date: '2023-07-22',
    regime: 'MONSOON_DEPRESSION',
    confidence: 0.923,
    loc: { name: 'Bhubaneswar (Odisha Coast)', lat: 20.30, lon: 85.80 },
    summary: 'A deep depression crossed the Odisha coast near Chandbali and tracked west-northwest across Chhattisgarh and MP, triggering extreme flooding along the Mahanadi and Narmada river basins.',
    risk: { heavy: 0.92, very_heavy: 0.68, extreme: 0.34 },
    class_probabilities: {
      ACTIVE_MONSOON: 0.045,
      BREAK_MONSOON: 0.002,
      MONSOON_DEPRESSION: 0.923,
      OROGRAPHIC_MONSOON: 0.021,
      COASTAL_REGIME: 0.009,
    },
    trough_lat: 20.4,
    indicators: [
      { name: 'Monsoon Trough Axis Lat', value: '20.4° N', note: 'South of normal, active cyclonic' },
      { name: '850 hPa Zonal LLJ', value: '22.6 m/s', note: 'Vigorous cross-equatorial surge' },
      { name: 'Precipitable Water (PWAT)', value: '68.5 kg/m²', note: 'Deep tropospheric saturation' },
      { name: 'MSLP Depression Core', value: '992.4 hPa', note: 'Pronounced cyclonic vortex' },
      { name: '850 hPa Relative Vorticity', value: '+8.4 × 10⁻⁵ s⁻¹', note: 'Intense low-level vorticity' },
      { name: 'CAPE', value: '2,450 J/kg', note: 'Vigorous convective towers' },
    ],
  },
  case_ghats_2023: {
    id: 'case_ghats_2023',
    name: 'July 2023: Western Ghats Orographic Surge',
    date: '2023-07-18',
    regime: 'OROGRAPHIC_MONSOON',
    confidence: 0.895,
    loc: { name: 'Mumbai (Konkan Coast)', lat: 19.08, lon: 72.88 },
    summary: 'A high-speed Somali low-level jet (> 22 m/s) directly slammed into the Western Ghats escarpment, delivering over 250 mm in 24 hours to coastal Konkan and Ghat ridges (Mahabaleshwar).',
    risk: { heavy: 0.94, very_heavy: 0.72, extreme: 0.38 },
    class_probabilities: {
      ACTIVE_MONSOON: 0.062,
      BREAK_MONSOON: 0.001,
      MONSOON_DEPRESSION: 0.031,
      OROGRAPHIC_MONSOON: 0.895,
      COASTAL_REGIME: 0.011,
    },
    trough_lat: 21.2,
    indicators: [
      { name: 'Monsoon Trough Axis Lat', value: '21.2° N', note: 'Normal central axis' },
      { name: '850 hPa Zonal LLJ', value: '24.5 m/s', note: 'Somali Jet core direct impingement' },
      { name: 'Precipitable Water (PWAT)', value: '66.8 kg/m²', note: 'High oceanic moisture flux' },
      { name: 'MSLP Peninsular Gradient', value: '4.6 hPa', note: 'Steep west coast gradient' },
      { name: '850 hPa Vorticity', value: '+3.8 × 10⁻⁵ s⁻¹', note: 'Coastal shear zone' },
      { name: 'CAPE', value: '1,920 J/kg', note: 'Orographic-convective hybrid' },
    ],
  },
  case_wd_2023: {
    id: 'case_wd_2023',
    name: 'July 2023: Delhi-Yamuna Flood (WD + Monsoon Synergy)',
    date: '2023-07-09',
    regime: 'WESTERN_DISTURBANCE',
    confidence: 0.842,
    loc: { name: 'Delhi NCR', lat: 28.61, lon: 77.21 },
    summary: 'Historic interaction between an anomalous mid-latitude Western Disturbance trough and the Arabian Sea monsoon moisture branch caused record 153 mm/day rainfall in Delhi and extreme Yamuna river swell.',
    risk: { heavy: 0.86, very_heavy: 0.58, extreme: 0.28 },
    class_probabilities: {
      ACTIVE_MONSOON: 0.084,
      BREAK_MONSOON: 0.012,
      MONSOON_DEPRESSION: 0.041,
      OROGRAPHIC_MONSOON: 0.021,
      COASTAL_REGIME: 0.000,
      WESTERN_DISTURBANCE: 0.842,
    },
    trough_lat: 28.5,
    indicators: [
      { name: 'Monsoon Trough Axis Lat', value: '28.5° N', note: 'Extratropical trough synergy' },
      { name: '500 hPa Geopotential Height Anomaly', value: '-85 m', note: 'Deep upper-level cold trough' },
      { name: 'Precipitable Water (PWAT)', value: '58.4 kg/m²', note: 'Dual moisture convergence' },
      { name: 'MSLP Northwest Anomaly', value: '-6.2 hPa', note: 'Anomalous low over Punjab/Haryana' },
      { name: '850 hPa Vorticity', value: '+6.2 × 10⁻⁵ s⁻¹', note: 'Strong baroclinic vorticity' },
      { name: 'CAPE', value: '2,800 J/kg', note: 'Extreme storm instability' },
    ],
  },
}

// Physically grounded dynamic prediction simulator
export function getDynamicPrediction(loc = { lat: 20.3, lon: 85.8 }, horizon = '24h', caseId = null) {
  if (caseId && BENCHMARK_CASES[caseId]) {
    const c = BENCHMARK_CASES[caseId]
    return {
      date: c.date,
      init_time: `${c.date} 00:00 UTC`,
      horizon: `${horizon} (${horizon === '24h' ? 'Day 1' : horizon === '48h' ? 'Day 2' : horizon === '72h' ? 'Day 3' : 'Day 5'})`,
      data_source: 'NOAA GFS 0.25° NWP + RituGyan ML Post-Processor',
      model_version: 'v2.4-regime-lgbm',
      regime: c.regime,
      confidence: c.confidence,
      class_probabilities: c.class_probabilities,
      risk: c.risk,
      synoptic_indicators: c.indicators,
      raw_gfs_comparison: {
        raw_gfs_rain: +(c.risk.heavy * 45).toFixed(1),
        ritugyan_calibrated_rain: +(c.risk.heavy * 78).toFixed(1),
        bias_correction: `Bias corrected (+${(c.risk.heavy * 33).toFixed(1)} mm/day)`,
        gfs_heavy_prob: +(c.risk.heavy * 0.58).toFixed(2),
        ml_heavy_prob: c.risk.heavy,
      },
      indicators: c.indicators.slice(0, 4).map((i) => ({ name: i.name, value: i.value })),
    }
  }

  const lat = Number(loc.lat) || 20.3
  const lon = Number(loc.lon) || 85.8

  // Spatial clustering heuristics across Indian subcontinent
  const isWesternGhats = lon >= 72.5 && lon <= 76.5 && lat >= 8.5 && lat <= 21.0
  const isEastCoast = lon >= 82.0 && lon <= 89.0 && lat >= 17.0 && lat <= 23.0
  const isFoothillsOrNE = (lat >= 25.0 && lon >= 84.0) || lon >= 90.0
  const isNorthwest = lat >= 27.5 && lon >= 72.0 && lon <= 79.5
  const isCentralCore = lat >= 19.0 && lat <= 25.0 && lon >= 75.0 && lon <= 84.0

  let primaryRegime = 'ACTIVE_MONSOON'
  let confidence = 0.885
  let heavy = 0.55
  let veryHeavy = 0.22
  let extreme = 0.05
  let troughLat = 21.5
  let llj = 16.5
  let pwat = 58.2

  if (isWesternGhats) {
    primaryRegime = 'OROGRAPHIC_MONSOON'
    confidence = 0.912
    heavy = 0.86
    veryHeavy = 0.58
    extreme = 0.24
    llj = 23.4
    pwat = 65.4
  } else if (isEastCoast) {
    primaryRegime = 'MONSOON_DEPRESSION'
    confidence = 0.894
    heavy = 0.82
    veryHeavy = 0.49
    extreme = 0.18
    troughLat = 20.1
    llj = 19.8
    pwat = 67.2
  } else if (isFoothillsOrNE) {
    primaryRegime = 'BREAK_MONSOON'
    confidence = 0.931
    heavy = 0.74
    veryHeavy = 0.38
    extreme = 0.12
    troughLat = 27.2
    llj = 9.2
    pwat = 63.8
  } else if (isNorthwest) {
    primaryRegime = lat > 29 ? 'WESTERN_DISTURBANCE' : 'ACTIVE_MONSOON'
    confidence = 0.845
    heavy = 0.48
    veryHeavy = 0.19
    extreme = 0.04
    troughLat = 24.8
    llj = 12.0
    pwat = 49.5
  } else if (isCentralCore) {
    primaryRegime = 'ACTIVE_MONSOON'
    confidence = 0.876
    heavy = 0.68
    veryHeavy = 0.32
    extreme = 0.08
    troughLat = 21.0
    llj = 17.5
    pwat = 59.5
  } else {
    primaryRegime = 'COASTAL_REGIME'
    confidence = 0.824
    heavy = 0.38
    veryHeavy = 0.14
    extreme = 0.02
    llj = 11.2
    pwat = 52.0
  }

  // Horizon attenuation (uncertainty slightly broadens as horizon extends)
  const hFactor = horizon === '24h' ? 1.0 : horizon === '48h' ? 0.94 : horizon === '72h' ? 0.88 : 0.80
  confidence = +(confidence * hFactor).toFixed(3)
  heavy = +(heavy * hFactor).toFixed(2)
  veryHeavy = +(veryHeavy * hFactor).toFixed(2)
  extreme = +(extreme * hFactor).toFixed(2)

  // Build probabilistic distribution
  const probs = {
    ACTIVE_MONSOON: 0.02,
    BREAK_MONSOON: 0.02,
    MONSOON_DEPRESSION: 0.02,
    OROGRAPHIC_MONSOON: 0.02,
    COASTAL_REGIME: 0.02,
  }
  probs[primaryRegime] = confidence
  const remainder = +(1.0 - confidence).toFixed(3)
  const otherKeys = Object.keys(probs).filter((k) => k !== primaryRegime)
  otherKeys.forEach((k) => {
    probs[k] = +(remainder / otherKeys.length).toFixed(3)
  })

  const today = new Date()
  if (horizon === '48h') today.setDate(today.getDate() + 1)
  if (horizon === '72h') today.setDate(today.getDate() + 2)
  if (horizon === '120h') today.setDate(today.getDate() + 4)
  const dateStr = today.toISOString().slice(0, 10)

  return {
    date: dateStr,
    init_time: `${new Date().toISOString().slice(0, 10)} 00:00 UTC`,
    horizon: `${horizon} (${horizon === '24h' ? 'Day 1' : horizon === '48h' ? 'Day 2' : horizon === '72h' ? 'Day 3' : 'Day 5'})`,
    data_source: 'NOAA GFS 0.25° NWP + RituGyan ML Post-Processor',
    model_version: 'v2.4-regime-lgbm',
    regime: primaryRegime,
    confidence,
    class_probabilities: probs,
    risk: { heavy, very_heavy: veryHeavy, extreme },
    synoptic_indicators: [
      { name: 'Monsoon Trough Axis Lat', value: `${troughLat.toFixed(1)}° N`, note: troughLat > 25 ? 'Foothills position' : 'Central peninsula axis' },
      { name: '850 hPa Zonal LLJ', value: `${llj.toFixed(1)} m/s`, note: llj > 18 ? 'Strong Somali jet core' : 'Moderate monsoon westerlies' },
      { name: 'Precipitable Water (PWAT)', value: `${pwat.toFixed(1)} kg/m²`, note: pwat > 60 ? 'Moisture saturated column' : 'Moderate moisture' },
      { name: 'MSLP Regional Gradient', value: `${(llj / 5).toFixed(1)} hPa`, note: 'Peninsular cross-gradient' },
      { name: '850 hPa Relative Vorticity', value: `+${(llj * 0.28).toFixed(1)} × 10⁻⁵ s⁻¹`, note: 'Cyclonic shear zone' },
      { name: 'Convective CAPE', value: `${Math.round(1400 + llj * 45)} J/kg`, note: 'Convective instability' },
    ],
    raw_gfs_comparison: {
      raw_gfs_rain: +(heavy * 48.2).toFixed(1),
      ritugyan_calibrated_rain: +(heavy * 72.5).toFixed(1),
      bias_correction: `Bias corrected (+${(heavy * 24.3).toFixed(1)} mm/day)`,
      gfs_heavy_prob: +(heavy * 0.62).toFixed(2),
      ml_heavy_prob: heavy,
    },
    indicators: [
      { name: '850 hPa U-wind (m/s)', value: +llj.toFixed(1) },
      { name: 'Trough Axis Lat (°N)', value: +troughLat.toFixed(1) },
      { name: 'PWAT (kg/m²)', value: +pwat.toFixed(1) },
      { name: 'MSLP Gradient (hPa)', value: +(llj / 5).toFixed(1) },
    ],
  }
}

// Gridded spatial simulation with realistic synoptic features and Monsoon Trough Line
export const grid = (caseId = null) => {
  const g = []
  let troughLine = [
    [23.5, 69.0],
    [22.8, 75.0],
    [21.5, 81.0],
    [22.2, 87.5],
  ]

  // Default meteorological centers of action:
  // [center_lat, center_lon, radius_scale, peak_prob]
  let blobs = [
    [15.5, 74.0, 3.5, 0.90], // Western Ghats South
    [19.0, 73.0, 3.2, 0.88], // Konkan Coast / Mumbai
    [21.0, 85.5, 4.2, 0.85], // Odisha Depression Zone
    [23.5, 79.0, 5.0, 0.65], // Central India Trough Zone
    [26.2, 92.5, 3.8, 0.82], // Northeast / Assam
    [28.6, 77.2, 4.0, 0.35], // Northern Plains
  ]

  if (caseId === 'case_break_2024') {
    troughLine = [
      [27.8, 77.0],
      [27.2, 83.0],
      [26.8, 89.0],
      [27.2, 95.0],
    ]
    blobs = [
      [26.8, 92.5, 4.2, 0.95], // Extreme Northeast
      [26.2, 86.5, 3.8, 0.88], // Bihar / Sub-Himalaya
      [15.0, 74.5, 3.0, 0.25], // Western Ghats suppressed
      [21.0, 81.0, 5.0, 0.12], // Central dry spell
    ]
  } else if (caseId === 'case_depression_2023') {
    troughLine = [
      [21.2, 71.0],
      [20.5, 78.0],
      [19.8, 85.0],
      [20.2, 89.5],
    ]
    blobs = [
      [20.2, 85.8, 4.8, 0.96], // Deep depression core
      [21.5, 81.2, 4.5, 0.88], // Inflow band
      [16.0, 74.0, 3.5, 0.72], // Secondary surge
    ]
  } else if (caseId === 'case_ghats_2023') {
    blobs = [
      [18.8, 73.2, 3.0, 0.98], // Intense Konkan core
      [14.5, 74.8, 3.5, 0.94], // Coastal Karnataka
      [22.0, 84.0, 5.0, 0.52], // Moderate Central
    ]
  }

  // 1.5° resolution grid for crisp rendering without lag
  for (let lat = 8.5; lat <= 35.5; lat += 1.5) {
    for (let lon = 68.5; lon <= 96.5; lon += 1.5) {
      let v = 0.05
      for (const [a, b, s, h] of blobs) {
        v += h * Math.exp(-((lat - a) ** 2 + (lon - b) ** 2) / (2 * s * s))
      }
      // Natural geographic mask: omit deep Indian Ocean far south
      g.push({
        lat: +lat.toFixed(1),
        lon: +lon.toFixed(1),
        rainfall_probability: +Math.min(Math.max(v, 0.02), 0.98).toFixed(2),
      })
    }
  }

  return { grid: g, trough_line: troughLine }
}

// Verification suite: Full statistical rigor comparing RituGyan ML vs Raw NOAA GFS NWP
export const verification = {
  period: 'Monsoon 2021–2024 Independent Validation (IMD 0.25° Gridded Ground Truth)',
  metrics: {
    RMSE: 12.4,
    MAE: 7.8,
    Bias: -1.2,
    ETS: 0.41,
    CSI: 0.64,
    POD: 0.72,
    FAR: 0.21,
    FSS: 0.58,
  },
  gfs_baseline_metrics: {
    RMSE: 16.8,
    MAE: 10.5,
    Bias: +4.8,
    ETS: 0.24,
    CSI: 0.42,
    POD: 0.58,
    FAR: 0.39,
    FSS: 0.44,
  },
  brier_score: {
    ritugyan_ml: 0.086,
    raw_gfs: 0.162,
    improvement_pct: 46.9,
  },
  // Reliability Diagram (Calibration Curve)
  reliability_curve: [
    { forecast_prob: 5, observed_freq: 4.8, raw_gfs_freq: 14.2, count: 4200 },
    { forecast_prob: 15, observed_freq: 14.1, raw_gfs_freq: 26.5, count: 3850 },
    { forecast_prob: 25, observed_freq: 24.3, raw_gfs_freq: 38.1, count: 3100 },
    { forecast_prob: 35, observed_freq: 34.8, raw_gfs_freq: 46.2, count: 2850 },
    { forecast_prob: 45, observed_freq: 44.5, raw_gfs_freq: 52.4, count: 2400 },
    { forecast_prob: 55, observed_freq: 54.2, raw_gfs_freq: 58.9, count: 2150 },
    { forecast_prob: 65, observed_freq: 64.9, raw_gfs_freq: 66.2, count: 1820 },
    { forecast_prob: 75, observed_freq: 74.2, raw_gfs_freq: 71.0, count: 1450 },
    { forecast_prob: 85, observed_freq: 84.6, raw_gfs_freq: 75.4, count: 1120 },
    { forecast_prob: 95, observed_freq: 93.8, raw_gfs_freq: 78.1, count: 860 },
  ],
  // Skill scores across rainfall thresholds (mm/day)
  threshold_skills: [
    { threshold: '≥ 15.6 mm (Moderate)', mm: 15.6, ml_csi: 0.74, gfs_csi: 0.56, ml_ets: 0.52, gfs_ets: 0.35, ml_pod: 0.85, gfs_pod: 0.72, ml_far: 0.15, gfs_far: 0.31 },
    { threshold: '≥ 35.5 mm (Rather Heavy)', mm: 35.5, ml_csi: 0.69, gfs_csi: 0.49, ml_ets: 0.46, gfs_ets: 0.29, ml_pod: 0.79, gfs_pod: 0.65, ml_far: 0.18, gfs_far: 0.35 },
    { threshold: '≥ 64.5 mm (Heavy)', mm: 64.5, ml_csi: 0.64, gfs_csi: 0.42, ml_ets: 0.41, gfs_ets: 0.24, ml_pod: 0.72, gfs_pod: 0.58, ml_far: 0.21, gfs_far: 0.39 },
    { threshold: '≥ 115.6 mm (Very Heavy)', mm: 115.6, ml_csi: 0.52, gfs_csi: 0.28, ml_ets: 0.34, gfs_ets: 0.15, ml_pod: 0.61, gfs_pod: 0.41, ml_far: 0.28, gfs_far: 0.52 },
    { threshold: '≥ 204.5 mm (Extremely Heavy)', mm: 204.5, ml_csi: 0.38, gfs_csi: 0.14, ml_ets: 0.26, gfs_ets: 0.08, ml_pod: 0.48, gfs_pod: 0.22, ml_far: 0.36, gfs_far: 0.68 },
  ],
  // Spatial Fractions Skill Score (FSS) scaling over neighborhood radius
  spatial_fss: [
    { radius_km: 25, ml_fss: 0.48, gfs_fss: 0.32, benchmark_skill: 0.5 },
    { radius_km: 50, ml_fss: 0.58, gfs_fss: 0.44, benchmark_skill: 0.5 },
    { radius_km: 75, ml_fss: 0.68, gfs_fss: 0.52, benchmark_skill: 0.5 },
    { radius_km: 100, ml_fss: 0.77, gfs_fss: 0.60, benchmark_skill: 0.5 },
    { radius_km: 150, ml_fss: 0.86, gfs_fss: 0.71, benchmark_skill: 0.5 },
    { radius_km: 200, ml_fss: 0.92, gfs_fss: 0.79, benchmark_skill: 0.5 },
  ],
  // Multiclass Confusion Matrix (Normalized % for Stage 1 LightGBM Classifier)
  confusion_matrix: {
    classes: ['Active', 'Break', 'Depression', 'Orographic', 'Coastal'],
    matrix: [
      [88.4, 2.1, 4.5, 3.2, 1.8], // Active true
      [1.8, 92.6, 0.8, 3.6, 1.2], // Break true
      [5.2, 0.4, 89.8, 2.5, 2.1], // Depression true
      [3.1, 1.5, 1.8, 91.4, 2.2], // Orographic true
      [4.2, 2.0, 3.1, 4.5, 86.2], // Coastal true
    ],
  },
}

// Metadata with model architectures, datasets, and operational locations
export const metadata = {
  model: {
    name: 'RituGyan Two-Stage Regime-Aware Engine',
    type: 'Hybrid Synoptic LightGBM Classifier + Quantile Regressor with Generalized Pareto Tail Model',
    stage1: {
      name: 'Stage 1: Synoptic Monsoon Regime Classifier',
      algorithm: 'LightGBM Multiclass Gradient Boosting (5 classes)',
      objective: 'multiclass (cross-entropy with class-balanced weighting)',
      hyperparameters: {
        n_estimators: 350,
        learning_rate: 0.04,
        num_leaves: 31,
        max_depth: 6,
        feature_fraction: 0.8,
        min_child_samples: 25,
      },
      trained_classes: ['ACTIVE_MONSOON', 'BREAK_MONSOON', 'MONSOON_DEPRESSION', 'OROGRAPHIC_MONSOON', 'COASTAL_REGIME'],
      untrained_classes: ['WESTERN_DISTURBANCE'],
    },
    stage2: {
      name: 'Stage 2: Regime-Conditioned Quantile Post-Processor',
      algorithm: 'Regime-Stratified Gradient Boosted Quantile Trees + Peaks-Over-Threshold (POT) EVT',
      objective: 'Pinball loss across 19 quantiles (τ ∈ [0.05, 0.95] step 0.05)',
      tail_treatment: 'Generalized Pareto Distribution (GPD) extrapolation for rainfall > 95th percentile',
    },
  },
  feature_importance: [
    { feature: '850 hPa Zonal Wind Shear (U850)', importance: 0.182, category: 'Wind Circulation' },
    { feature: 'Monsoon Trough Axis Latitude (°N)', importance: 0.165, category: 'Synoptic Dynamics' },
    { feature: 'Total Precipitable Water (PWAT)', importance: 0.148, category: 'Moisture' },
    { feature: '850 hPa Relative Vorticity', importance: 0.124, category: 'Dynamics' },
    { feature: 'MSLP North-South Gradient', importance: 0.108, category: 'Pressure' },
    { feature: '500 hPa Geopotential Anomaly', importance: 0.089, category: 'Mid-Troposphere' },
    { feature: '200 hPa Tropical Easterly Jet (TEJ)', importance: 0.076, category: 'Upper-Troposphere' },
    { feature: 'Moisture Flux Divergence (850 hPa)', importance: 0.058, category: 'Moisture' },
    { feature: 'Surface CAPE', importance: 0.032, category: 'Thermodynamics' },
    { feature: 'Elevation / SRTM Orography Slope', importance: 0.018, category: 'Topography' },
  ],
  datasets: [
    { name: 'NOAA GFS 0.25° NWP', role: 'operational', resolution: '0.25° (~27 km)', interval: '6-hourly (00, 06, 12, 18 UTC)', latency: '~3.5 hours' },
    { name: 'IMD Daily Gridded Rainfall (0.25°)', role: 'research', resolution: '0.25° spatial', interval: 'Daily accumulation', latency: 'T+1 day ground truth' },
    { name: 'ECMWF ERA5 Reanalysis', role: 'research', resolution: '0.25° atmosphere', interval: 'Hourly historical reanalysis', latency: 'Historical benchmark' },
    { name: 'NASA GPM IMERG Final Run', role: 'research', resolution: '0.1° satellite', interval: 'Half-hourly', latency: 'Satellite precipitation truth' },
    { name: 'SRTM 90m Digital Elevation Model', role: 'operational', resolution: '90m aggregated to 0.25°', interval: 'Static', latency: 'Orography & slope features' },
    { name: 'Survey of India Administrative Districts', role: 'operational', resolution: 'Vector GIS shapefiles', interval: 'Static', latency: 'Administrative masking' },
  ],
  locations: [
    { name: 'Bhubaneswar (Odisha)', lat: 20.3, lon: 85.8, zone: 'East Coast' },
    { name: 'Mumbai (Konkan)', lat: 19.08, lon: 72.88, zone: 'West Coast' },
    { name: 'Delhi NCR', lat: 28.61, lon: 77.21, zone: 'North India' },
    { name: 'Kolkata (Bengal)', lat: 22.57, lon: 88.36, zone: 'East India' },
    { name: 'Chennai (Coromandel)', lat: 13.08, lon: 80.27, zone: 'South Coast' },
    { name: 'Guwahati (Assam)', lat: 26.14, lon: 91.74, zone: 'Northeast' },
    { name: 'Nagpur (Vidarbha)', lat: 21.15, lon: 79.08, zone: 'Central India' },
    { name: 'Pune (Western Ghats Rainshadow)', lat: 18.52, lon: 73.85, zone: 'West' },
    { name: 'Bengaluru (Karnataka)', lat: 12.97, lon: 77.59, zone: 'South Interior' },
    { name: 'Patna (Gangetic Bihar)', lat: 25.6, lon: 85.14, zone: 'East' },
    { name: 'Jaipur (Rajasthan)', lat: 26.91, lon: 75.79, zone: 'Northwest' },
    { name: 'Kochi (Kerala Coast)', lat: 9.93, lon: 76.26, zone: 'West Coast' },
    { name: 'Bhopal (Madhya Pradesh)', lat: 23.26, lon: 77.41, zone: 'Central India' },
    { name: 'Dehradun (Uttarakhand)', lat: 30.32, lon: 78.03, zone: 'Himalayan Foothills' },
    { name: 'Shimla (Himachal)', lat: 31.1, lon: 77.17, zone: 'Himalayas' },
  ],
  evaluation_example: {
    date: '2024-06-21',
    candidate: 'BREAK_MONSOON',
    ml: 'BREAK_MONSOON',
    confidence: 0.946,
    match: true,
    trough_lat: 27.8,
  },
}
