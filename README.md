# RituGyan Frontend

**Regime-Aware Probabilistic Post-Processing for Numerical Weather Prediction (NOAA GFS) Rainfall over the Indian Monsoon.**

Built with React 18, Vite 5, Tailwind CSS, Leaflet / React-Leaflet, and Recharts.

---

## Key Capabilities

1. **Two-Stage Machine Learning Architecture**:
   - **Stage 1 (Synoptic Circulation Classifier)**: Multiclass LightGBM classifier identifying the active monsoon regime (`Active Monsoon`, `Break Monsoon`, `Monsoon Depression`, `Orographic Surge`, `Coastal Convergence`, `Western Disturbance`) from 850 hPa wind shear, monsoon trough latitude, precipitable water (PWAT), and relative vorticity.
   - **Stage 2 (Regime-Conditioned Quantile Post-Processing & EVT)**: Quantile regression gradient boosting coupled with Generalized Pareto Distribution (GPD) Peaks-Over-Threshold (POT) modeling for extreme rainfall tails (> 95th percentile).

2. **IMD Color-Coded Early Warning System**:
   - Automated mapping into India Meteorological Department (IMD) early warning levels: **Red (Take Action)**, **Orange (Be Prepared)**, **Yellow (Be Updated)**, and **Green (Normal)**.
   - Multi-sector operational directives for Agriculture, Urban Drainage, NDRF/Disaster Mitigation, and Dam/Reservoir Hydrology.

3. **NWP Value-Add Diagnostic Suite**:
   - Side-by-side comparison between **Raw NOAA GFS NWP** and **RituGyan Calibrated ML**.
   - Reliability diagrams (calibration curves) demonstrating well-calibrated probabilities and Brier Score error reduction (+46.9%).
   - Threshold-dependent skill scores (CSI, ETS, POD, FAR) across 15.6mm, 35.5mm, 64.5mm, 115.6mm, and 204.5mm categories.
   - Spatial Fractions Skill Score (FSS) scaling across neighborhood radii (25 km to 200 km).
   - Multiclass Confusion Matrix for synoptic regimes.

4. **Interactive Spatial Map & Scenario Exploration**:
   - Synoptic Monsoon Trough Axis line rendering over regional precipitation fields.
   - 20+ preset Indian meteorological stations across coastal, peninsular, foothills, and continental zones.
   - Dynamic simulation engine that reacts to coordinates, forecast horizon (Day 1 to Day 5), and 4 historical benchmark case studies (June 2024 Break Spell, July 2023 Bay Depression, Western Ghats Orographic Surge, July 2023 Delhi Flood).
   - One-click **Download Official Brief** operational report export.

---

## Getting Started

```bash
# Navigate to project directory
cd ritugyan-frontend/ritugyan

# Install dependencies
npm install

# Start development server
npm run dev              # http://localhost:5173

# Production build
npm run build
```

## Connecting FastAPI Backend

1. In `.env`:
   ```bash
   VITE_DEMO_MODE=false
   VITE_API_BASE_URL=http://localhost:8000
   ```
2. API Endpoints (`src/services/api.js`):
   - `GET /health`
   - `GET /metadata`
   - `POST /predict` (`{ latitude, longitude, date, horizon }`)
   - `GET /regime`
   - `GET /forecast` (`{ grid: [{ lat, lon, rainfall_probability }], trough_line: [...] }`)
   - `GET /verification` (`{ metrics, gfs_baseline_metrics, brier_score, reliability_curve, threshold_skills, spatial_fss, confusion_matrix }`)
3. Data adapters are centralized in `src/services/adapters.js`.
