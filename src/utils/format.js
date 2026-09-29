export const pct = (v, d = 1) => (v == null ? '—' : `${(v * 100).toFixed(d)}%`)
export const num = (v, d = 2) => (v == null ? 'n/a' : typeof v === 'number' ? v.toFixed(d) : String(v))
export const regimeName = (k) => (k ? k.replace(/_/g, ' ') : 'Unknown')
export const regimeTitle = (k) =>
  k ? k.toLowerCase().split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') : 'Unknown'

// Authentic Tropical Monsoon Doppler Radar Rainfall Palette
export const RAIN_PALETTE = {
  drizzle: '#06b6d4',      // Dewy Mist / Light Rain Cyan
  moderate: '#059669',     // Lush Monsoon Emerald Green
  heavy: '#2563eb',        // Deep Torrential Cobalt Blue
  veryHeavy: '#7c3aed',    // Electrified Storm Violet
  extreme: '#e11d48',      // Cloudburst Crimson Deluge
}

// Rainfall thresholds (IMD standard meteorological categories with authentic rain colors)
export const THRESHOLDS = [
  {
    key: 'heavy',
    label: 'Heavy rainfall',
    mm: 64.5,
    short: 'Heavy Rain',
    imdCode: 'HR',
    color: RAIN_PALETTE.heavy,
    hindi: 'मूसलाधार बारिश',
    glowClass: 'shadow-blue-500/20',
  },
  {
    key: 'veryHeavy',
    label: 'Very heavy rainfall',
    mm: 115.6,
    short: 'Very Heavy',
    imdCode: 'VHR',
    color: RAIN_PALETTE.veryHeavy,
    hindi: 'भारी से बहुत भारी',
    glowClass: 'shadow-purple-500/20',
  },
  {
    key: 'extreme',
    label: 'Extremely heavy rainfall',
    mm: 204.5,
    short: 'Cloudburst Deluge',
    imdCode: 'EHR',
    color: RAIN_PALETTE.extreme,
    hindi: 'अत्यंत भीषण वर्षा',
    glowClass: 'shadow-rose-500/20',
  },
]

export const ALL_THRESHOLDS = [
  {
    key: 'moderate',
    label: 'Moderate rainfall',
    mm: 15.6,
    short: 'Moderate Showers',
    color: RAIN_PALETTE.moderate,
    hindi: 'मध्यम वर्षा',
  },
  {
    key: 'heavy',
    label: 'Heavy rainfall',
    mm: 64.5,
    short: 'Heavy Downpour',
    color: RAIN_PALETTE.heavy,
    hindi: 'मूसलाधार वर्षा',
  },
  {
    key: 'veryHeavy',
    label: 'Very heavy rainfall',
    mm: 115.6,
    short: 'Very Heavy Rain',
    color: RAIN_PALETTE.veryHeavy,
    hindi: 'भारी से अति भारी',
  },
  {
    key: 'extreme',
    label: 'Extremely heavy rainfall',
    mm: 204.5,
    short: 'Cloudburst Extreme',
    color: RAIN_PALETTE.extreme,
    hindi: 'बादल फटना / प्रलय',
  },
]

// Map legend: Monsoon Doppler Radar precipitation probability spectrum
export const BINS = [
  { max: 0.2, label: 'Drizzle / Mist (< 20%)', color: '#06b6d4', hindi: 'रिमझिम' },
  { max: 0.4, label: 'Moderate Rain (20-40%)', color: '#059669', hindi: 'वर्षा' },
  { max: 0.6, label: 'Heavy Downpour (40-60%)', color: '#2563eb', hindi: 'मूसलाधार' },
  { max: 0.8, label: 'Very Heavy (60-80%)', color: '#7c3aed', hindi: 'अति भारी' },
  { max: 1.01, label: 'Extremely Heavy (> 80%)', color: '#e11d48', hindi: 'बादल फटना' },
]

export const binFor = (v) => BINS.find((b) => v < b.max) ?? BINS[BINS.length - 1]

// IMD Color-Coded Warning Levels
export const IMD_ALERTS = {
  red: {
    level: 'RED',
    action: 'Warning (Take Action)',
    description: 'Extremely severe weather expected. Widespread disruption to transport, power, and high risk of inundation.',
    badgeClass: 'bg-red-500/15 border-red-500 text-red-700 dark:text-red-400',
    dotClass: 'bg-red-600 animate-pulse',
    borderClass: 'border-l-4 border-l-red-600',
  },
  orange: {
    level: 'ORANGE',
    action: 'Alert (Be Prepared)',
    description: 'Very heavy precipitation likely. Waterlogging in low-lying roads and potential localized flash flooding.',
    badgeClass: 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400',
    dotClass: 'bg-amber-500',
    borderClass: 'border-l-4 border-l-amber-500',
  },
  yellow: {
    level: 'YELLOW',
    action: 'Watch (Be Updated)',
    description: 'Moderate to heavy isolated showers. Keep track of daily weather progression and river levels.',
    badgeClass: 'bg-yellow-500/15 border-yellow-500 text-yellow-700 dark:text-yellow-400',
    dotClass: 'bg-yellow-500',
    borderClass: 'border-l-4 border-l-yellow-500',
  },
  green: {
    level: 'GREEN',
    action: 'No Warning (Normal Weather)',
    description: 'No severe weather alert. Normal seasonal monsoon conditions or light precipitation.',
    badgeClass: 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400',
    dotClass: 'bg-emerald-500',
    borderClass: 'border-l-4 border-l-emerald-500',
  },
}

export function getImdAlert(risk = {}) {
  const h = risk.heavy ?? 0
  const vh = risk.veryHeavy ?? 0
  const ex = risk.extreme ?? 0

  if (ex >= 0.15 || vh >= 0.45 || h >= 0.75) return IMD_ALERTS.red
  if (vh >= 0.20 || h >= 0.45) return IMD_ALERTS.orange
  if (h >= 0.20 || vh >= 0.10) return IMD_ALERTS.yellow
  return IMD_ALERTS.green
}

// Synoptic Monsoon Regime Details & Physical Mechanisms
export const REGIME_DETAILS = {
  ACTIVE_MONSOON: {
    title: 'Active Monsoon Phase (सक्रिय मानसून)',
    code: 'ACTIVE_MONSOON',
    summary: 'Normal or south-of-normal monsoon trough axis across Central India driving widespread deep convective rainfall.',
    troughAxis: 'Normal (20°N – 22°N across Central India)',
    lljWinds: 'Strong westerly Low-Level Jet (15–22 m/s at 850 hPa) across the peninsula',
    affectedRegions: 'Central India (Madhya Pradesh, Vidarbha, Chhattisgarh), Odisha, Konkan & Goa',
    pwatRange: '55 – 65 kg/m²',
    hazardProfile: 'Widespread moderate-to-heavy precipitation with recurring convective pulses. River basin runoff high.',
    icon: 'CloudRain',
  },
  BREAK_MONSOON: {
    title: 'Break Monsoon Spell (मानसून विच्छेद)',
    code: 'BREAK_MONSOON',
    summary: 'Monsoon trough shifts abruptly north to the Himalayan foothills, shutting down rain over central India while triggering foothill floods.',
    troughAxis: 'Shifted North (> 26°N – 28°N along Himalayan foothills)',
    lljWinds: 'Weakened peninsular westerlies (< 10 m/s); easterly flow along northern plains',
    affectedRegions: 'Himalayan foothills, Sub-Himalayan West Bengal, Assam, Arunachal Pradesh, Bihar (Flood risk); Central & Peninsular India (Drought/dry spell)',
    pwatRange: '35 – 45 kg/m² (Central India) / 60+ kg/m² (Foothills)',
    hazardProfile: 'Bimodal: Severe flood threat in Brahmaputra and Kosi basins; simultaneous agricultural dry spell across central food bowls.',
    icon: 'Wind',
  },
  MONSOON_DEPRESSION: {
    title: 'Monsoon Depression System (मानसून अवदाब)',
    code: 'MONSOON_DEPRESSION',
    summary: 'Synoptic-scale cyclonic vortex formed over Bay of Bengal tracking west-northwestward along the monsoon trough.',
    troughAxis: 'Intense cyclonic curvature (19°N – 21°N), central pressure drop 4–8 hPa',
    lljWinds: 'Vigorous dual-branch moisture pumping from Arabian Sea and Bay of Bengal (> 20 m/s)',
    affectedRegions: 'Odisha, West Bengal, Jharkhand, Chhattisgarh, East Madhya Pradesh, Vidarbha, Telangana',
    pwatRange: '62 – 72 kg/m²',
    hazardProfile: 'Extreme localized deluge in the southwest quadrant of the depression. Rapid reservoir surge and flash floods.',
    icon: 'AlertTriangle',
  },
  OROGRAPHIC_MONSOON: {
    title: 'Orographic Monsoon Surge (पर्वतीय वर्षा प्रवाह)',
    code: 'OROGRAPHIC_MONSOON',
    summary: 'Vigorous moisture-saturated Arabian Sea winds forced perpendicular to steep Western Ghats and Meghalaya topography.',
    troughAxis: 'Active peninsular pressure gradient (MSLP gradient > 3.5 hPa)',
    lljWinds: 'Somali Jet core directly impinging coastal barrier (20–28 m/s at 850 hPa)',
    affectedRegions: 'Konkan, Goa, Coastal Karnataka, Western Ghats crests (Mahabaleshwar, Agumbe), Meghalaya Plateau',
    pwatRange: '58 – 68 kg/m²',
    hazardProfile: 'Continuous orographic lifting producing extreme 24h accumulations (> 200 mm/day). High landslide and mudslip hazards.',
    icon: 'Mountain',
  },
  COASTAL_REGIME: {
    title: 'Coastal Convergence Regime (तटीय अभिसरण)',
    code: 'COASTAL_REGIME',
    summary: 'Mesoscale convergence between the ambient synoptic wind and diurnal sea-breeze front along maritime shorelines.',
    troughAxis: 'Coastal boundary-layer convergence zone',
    lljWinds: 'Moderate with diurnal sea-breeze thermal oscillations (8–14 m/s)',
    affectedRegions: 'Coromandel Coast, Tamil Nadu, Coastal Andhra Pradesh, Saurashtra coast',
    pwatRange: '50 – 60 kg/m²',
    hazardProfile: 'Short-duration cloudbursts, severe urban localized waterlogging, and coastal squall gusts.',
    icon: 'Compass',
  },
  WESTERN_DISTURBANCE: {
    title: 'Western Disturbance Interaction (पश्चिमी विक्षोभ)',
    code: 'WESTERN_DISTURBANCE',
    summary: 'Mid-latitude upper-tropospheric trough interacting with tropical monsoon moisture over Northwest India.',
    troughAxis: 'Extratropical trough intrusion (28°N – 34°N)',
    lljWinds: 'Synergistic moisture feed: Arabian Sea monsoon flow meeting mid-latitude westerly jet',
    affectedRegions: 'Himachal Pradesh, Uttarakhand, Punjab, Haryana, Delhi NCR, Western UP',
    pwatRange: '45 – 55 kg/m²',
    hazardProfile: 'Catastrophic hybrid storms, rapid mountain river swelling (Yamuna/Beas), cloudbursts, and bridge washouts.',
    icon: 'Zap',
  },
}

// Verification Metrics with Full Explanations & Target Directions
export const METRICS = [
  ['RMSE', 'Root Mean Square Error: Measures overall magnitude of rainfall forecast errors in mm. Lower is better.'],
  ['MAE', 'Mean Absolute Error: Average absolute difference between forecasted and observed rainfall in mm. Lower is better.'],
  ['Bias', 'Mean Forecast Bias: Mean forecast minus observation. 0 is unbiased; positive indicates over-prediction; negative indicates dry bias.'],
  ['ETS', 'Equitable Threat Score: Skill in predicting precipitation events over random chance. Perfect score is 1.0; 0 means no skill over chance.'],
  ['CSI', 'Critical Success Index: Ratio of hits to total hits + misses + false alarms. Measures threat detection accuracy.'],
  ['POD', 'Probability of Detection (Hit Rate): Proportion of observed rain events that were correctly forecasted. Higher is better.'],
  ['FAR', 'False Alarm Ratio: Proportion of forecasted rain events that did not occur. Lower is better.'],
  ['FSS', 'Fractions Skill Score: Evaluates spatial accuracy across varying grid neighborhood scales. > 0.5 indicates actionable spatial skill.'],
]

export const METRIC_DETAILS = {
  RMSE: { name: 'Root Mean Square Error', unit: 'mm/day', target: 'Lower', baseline: '16.8 mm', model: '12.4 mm', gain: '+26.2% improvement' },
  MAE: { name: 'Mean Absolute Error', unit: 'mm/day', target: 'Lower', baseline: '10.5 mm', model: '7.8 mm', gain: '+25.7% improvement' },
  Bias: { name: 'Mean Bias', unit: 'mm/day', target: 'Closer to 0', baseline: '+4.8 mm (wet bias)', model: '-1.2 mm', gain: 'Bias mitigated' },
  ETS: { name: 'Equitable Threat Score', unit: 'score [0-1]', target: 'Higher', baseline: '0.24', model: '0.41', gain: '+70.8% skill gain' },
  CSI: { name: 'Critical Success Index', unit: 'score [0-1]', target: 'Higher', baseline: '0.42', model: '0.64', gain: '+52.4% gain' },
  POD: { name: 'Probability of Detection', unit: 'ratio [0-1]', target: 'Higher', baseline: '0.58', model: '0.72', gain: '+24.1% more hits' },
  FAR: { name: 'False Alarm Ratio', unit: 'ratio [0-1]', target: 'Lower', baseline: '0.39', model: '0.21', gain: '-46.2% false alarms' },
  FSS: { name: 'Fractions Skill Score (50km)', unit: 'score [0-1]', target: 'Higher', baseline: '0.44', model: '0.58', gain: '+31.8% spatial skill' },
}

// Actionable Multi-Sector Advisories
export function getSectorAdvisories(regime, risk = {}) {
  const alert = getImdAlert(risk)
  const isHigh = alert.level === 'RED' || alert.level === 'ORANGE'
  const isModerate = alert.level === 'YELLOW'

  return [
    {
      sector: 'Agriculture & Cropping',
      icon: 'Sprout',
      status: isHigh ? 'Precautionary Action' : isModerate ? 'Monitor Conditions' : 'Normal Operations',
      statusColor: isHigh ? 'text-red-600 dark:text-red-400' : isModerate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
      action: isHigh
        ? 'Postpone pesticide spraying and fertilizer application to prevent runoff loss. Ensure drainage outlets in low-lying paddy and cotton fields are cleared.'
        : isModerate
        ? 'Complete ongoing kharif sowing and weeding. Maintain bund heights to retain expected rainfall; prepare secondary drainage trenches.'
        : 'Favorable field operations window. Continue routine irrigation and harvesting operations as scheduled.',
    },
    {
      sector: 'Urban Infrastructure & Municipal',
      icon: 'Building2',
      status: isHigh ? 'High Inundation Risk' : isModerate ? 'Watch Waterways' : 'Normal Flow',
      statusColor: isHigh ? 'text-red-600 dark:text-red-400' : isModerate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
      action: isHigh
        ? 'Activate municipal stormwater dewatering pumps in underpasses and known inundation choke points. Deploy traffic diversion around flood-prone arterial corridors.'
        : isModerate
        ? 'Inspect critical storm drains and culverts for debris blockage. Position emergency standby pumping teams near transit corridors.'
        : 'Urban drainage capacity adequate for anticipated precipitation. Standard maintenance schedule.',
    },
    {
      sector: 'Disaster Management (NDRF / SDMA)',
      icon: 'ShieldAlert',
      status: isHigh ? 'Pre-position Teams' : isModerate ? 'Standby Notice' : 'Routine Vigil',
      statusColor: isHigh ? 'text-red-600 dark:text-red-400' : isModerate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
      action: isHigh
        ? 'Alert State Disaster Response Force (SDRF) battalions. Prepare emergency shelter inventory in flood-prone riverine belts. Restrict tourist entry in ghat landslide zones.'
        : isModerate
        ? 'Issue VHF weather advisories to district control rooms. Verify river gauge telemetry frequencies and satellite communication uplinks.'
        : 'Normal operational readiness across regional disaster response units.',
    },
    {
      sector: 'Hydrology & Dam Operations',
      icon: 'Droplets',
      status: isHigh ? 'Controlled Discharge' : isModerate ? 'Catchment Inflow Watch' : 'Conservation Mode',
      statusColor: isHigh ? 'text-red-600 dark:text-red-400' : isModerate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
      action: isHigh
        ? 'Initiate pre-depletion reservoir discharge to create flood buffer in upstream dams. Coordinate downstream spillway warnings with district magistrates.'
        : isModerate
        ? 'Monitor 6-hour inflow hydrographs from upstream catchments. Maintain spillway gates on automated telemetry check.'
        : 'Maintain standard seasonal rule curve filling trajectory. No emergency spillway releases required.',
    },
  ]
}
