import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Rectangle,
  CircleMarker,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, Maximize2, Layers, CloudRain } from 'lucide-react'
import { Card } from '../common/common'
import { BINS, binFor, pct } from '../../utils/format'
import useAsync from '../../hooks/useAsync'
import { useSite } from '../../hooks/useSite'
import { getMetadata } from '../../services/api'

const VIEWS = {
  india: { label: 'All India', center: [22.5, 80], zoom: 5 },
  monsoon: { label: 'Monsoon Core Zone', center: [21, 79], zoom: 6 },
  ghats: { label: 'Western Ghats', center: [16, 74.5], zoom: 7 },
  northeast: { label: 'Northeast India', center: [26, 92], zoom: 6 },
  north: { label: 'Northwest & Gangetic', center: [28.5, 78], zoom: 6 },
}

const MAP_THEMES = {
  radar: {
    label: '🌧️ Monsoon Radar',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  },
  darkStorm: {
    label: '⚡ Storm Night',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  },
  osm: {
    label: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
}

function Controller({ view }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(VIEWS[view].center, VIEWS[view].zoom, { duration: 0.6 })
  }, [view, map])
  return null
}

function Picker({ onPick }) {
  useMapEvents({
    click: (e) =>
      onPick({
        name: `Lat ${e.latlng.lat.toFixed(2)}°, Lon ${e.latlng.lng.toFixed(2)}°`,
        lat: +e.latlng.lat.toFixed(2),
        lon: +e.latlng.lng.toFixed(2),
      }),
  })
  return null
}

export function MapLegend() {
  return (
    <div
      className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-line bg-card/95 p-3 text-xs shadow-lg backdrop-blur-md"
      aria-label="Monsoon Doppler radar legend"
    >
      <div className="flex items-center gap-1.5 mb-2 font-semibold text-fg">
        <CloudRain size={14} className="text-cyan-500" />
        <span>Monsoon Radar Palette</span>
      </div>
      <div className="space-y-1.5">
        {BINS.map((b) => (
          <div key={b.label} className="flex items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-xs shrink-0 shadow-xs"
                style={{ background: b.color }}
              />
              <span className="text-fg font-medium">{b.label}</span>
            </div>
            <span className="font-mono text-muted text-[10px]">{b.hindi}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 border-t border-line/60 pt-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-4 border-b-2 border-dashed border-red-500" />
          <span className="text-muted">Monsoon Trough</span>
        </div>
        <span className="font-mono text-muted text-[10px]">द्रोणी रेखा</span>
      </div>
    </div>
  )
}

export default function RainfallMap({ grid, loc, onPick }) {
  const [view, setView] = useState('india')
  const [mapTheme, setMapTheme] = useState('radar')
  const [showTrough, setShowTrough] = useState(true)
  const [showStations, setShowStations] = useState(true)
  const meta = useAsync(getMetadata, [])
  const places = meta.data?.locations ?? []

  const h = (grid.step || 1.5) / 2

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {/* Regional View Presets */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(VIEWS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              aria-pressed={view === k}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                view === k
                  ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold'
                  : 'border-line text-muted hover:border-line hover:text-fg'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Map Theme & Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={mapTheme}
            onChange={(e) => setMapTheme(e.target.value)}
            className="rounded border border-line bg-card px-2 py-0.5 text-xs text-fg focus:border-accent focus:outline-hidden"
          >
            {Object.entries(MAP_THEMES).map(([k, t]) => (
              <option key={k} value={k}>
                {t.label}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 cursor-pointer text-muted hover:text-fg">
            <input
              type="checkbox"
              checked={showTrough}
              onChange={(e) => setShowTrough(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            <span>Trough Axis</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-muted hover:text-fg">
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => setShowStations(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            <span>Stations</span>
          </label>
        </div>
      </div>

      <div className="relative h-[450px] overflow-hidden rounded-xl border border-line shadow-sm">
        <MapContainer
          center={VIEWS.india.center}
          zoom={VIEWS.india.zoom}
          preferCanvas
          className="h-full w-full"
        >
          <TileLayer
            key={mapTheme}
            attribution={MAP_THEMES[mapTheme].attribution}
            url={MAP_THEMES[mapTheme].url}
          />
          <Controller view={view} />
          <Picker onPick={onPick} />

          {/* Gridded Rainfall Probability Cells with Doppler Glow */}
          {grid.cells.map((c) => {
            const b = binFor(c.value)
            return (
              <Rectangle
                key={`${c.lat}_${c.lon}`}
                bounds={[
                  [c.lat - h, c.lon - h],
                  [c.lat + h, c.lon + h],
                ]}
                pathOptions={{
                  color: b.color,
                  fillColor: b.color,
                  fillOpacity: 0.62,
                  weight: 0.8,
                  opacity: 0.4,
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs p-1">
                    <p className="font-bold text-fg flex items-center gap-1">
                      <CloudRain size={13} style={{ color: b.color }} />
                      {c.lat}°N, {c.lon}°E
                    </p>
                    <p className="mt-1">
                      Rainfall Probability: <b>{pct(c.value, 0)}</b>
                    </p>
                    <p className="text-muted">
                      Intensity: <span className="font-semibold" style={{ color: b.color }}>{b.label}</span> ({b.hindi})
                    </p>
                  </div>
                </Tooltip>
              </Rectangle>
            )
          })}

          {/* Synoptic Monsoon Trough Line */}
          {showTrough && grid.troughLine && grid.troughLine.length > 1 && (
            <Polyline
              positions={grid.troughLine}
              pathOptions={{
                color: '#ef4444',
                weight: 3.5,
                dashArray: '8, 8',
                opacity: 0.9,
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-semibold text-red-600">
                  Monsoon Trough Axis (मानसून द्रोणी रेखा)
                </div>
              </Tooltip>
            </Polyline>
          )}

          {/* Met Station Markers */}
          {showStations &&
            places.map((p) => (
              <CircleMarker
                key={p.name}
                center={[p.lat, p.lon]}
                radius={4.5}
                eventHandlers={{
                  click: () => onPick(p),
                }}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: '#0284c7',
                  fillOpacity: 0.95,
                  weight: 1.5,
                }}
              >
                <Tooltip>
                  <div className="text-xs">
                    <p className="font-bold text-fg">{p.name}</p>
                    <p className="text-muted">Click to select station</p>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}

          {/* Selected Location Target Pin with Rippling Rain Ring */}
          <CircleMarker
            center={[loc.lat, loc.lon]}
            radius={9}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#06b6d4',
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-bold text-xs flex items-center gap-1">
                📍 {loc.name}
              </span>
            </Tooltip>
          </CircleMarker>
        </MapContainer>
        <MapLegend />
      </div>

      <p className="mt-2 text-xs text-muted flex items-center justify-between">
        <span className="flex items-center gap-1">
          <CloudRain size={13} className="text-cyan-500" />
          Click anywhere on the map or select a station to retrieve the calibrated monsoon forecast.
        </span>
        <span className="font-mono text-[11px] text-fg font-semibold">
          Selected: {loc.lat}°N, {loc.lon}°E
        </span>
      </p>
    </div>
  )
}

// Location Selector with Quick Region Chips and Search
export function LocationSelector() {
  const { loc, setLoc } = useSite()
  const meta = useAsync(getMetadata, [])
  const [d, setD] = useState(loc)
  const [geoLoading, setGeoLoading] = useState(false)

  useEffect(() => setD(loc), [loc])
  const places = meta.data?.locations ?? []

  const handleGeoLocate = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false)
        const newLoc = {
          name: 'My Device Location',
          lat: +pos.coords.latitude.toFixed(2),
          lon: +pos.coords.longitude.toFixed(2),
        }
        setD(newLoc)
        setLoc(newLoc)
      },
      () => setGeoLoading(false),
      { timeout: 8000 }
    )
  }

  const inputClass =
    'mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg focus:border-accent focus:outline-hidden'

  const QUICK_CITIES = ['Bhubaneswar', 'Mumbai', 'Delhi NCR', 'Guwahati', 'Kolkata', 'Chennai']

  return (
    <Card
      title="Station & Regional Coordinates"
      subtitle="Select a target meteorological coordinates point"
      right={
        <button
          type="button"
          onClick={handleGeoLocate}
          disabled={geoLoading}
          className="flex items-center gap-1 rounded border border-line px-2 py-1 text-xs text-muted hover:border-accent hover:text-accent"
        >
          <Navigation size={12} className={geoLoading ? 'animate-spin' : ''} />
          <span>My GPS</span>
        </button>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setLoc({
            name: d.name ?? 'Custom Coordinate Point',
            lat: +Number(d.lat).toFixed(2),
            lon: +Number(d.lon).toFixed(2),
          })
        }}
      >
        {/* Quick Station Chips */}
        <div>
          <p className="text-xs font-medium text-muted">Quick Stations</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {QUICK_CITIES.map((name) => {
              const p = places.find((x) => x.name.includes(name))
              if (!p) return null
              const isSelected = loc.name === p.name
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => {
                    setD(p)
                    setLoc(p)
                  }}
                  className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'border-line text-muted hover:border-cyan-500 hover:text-fg'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dropdown Station Selector */}
        {places.length > 0 && (
          <label className="block text-xs font-medium text-muted">
            All Presets ({places.length} Stations)
            <select
              className={inputClass}
              value={places.some((p) => p.name === d.name) ? d.name : ''}
              onChange={(e) => {
                const p = places.find((x) => x.name === e.target.value)
                if (p) {
                  setD(p)
                  setLoc(p)
                }
              }}
            >
              <option value="">Choose a designated city...</option>
              {places.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.lat}°N, {p.lon}°E)
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-medium text-muted">
            Latitude (°N)
            <input
              className={inputClass}
              type="number"
              step="0.01"
              min="6"
              max="38"
              value={d.lat}
              onChange={(e) => setD({ ...d, name: 'Custom point', lat: e.target.value })}
            />
          </label>
          <label className="block text-xs font-medium text-muted">
            Longitude (°E)
            <input
              className={inputClass}
              type="number"
              step="0.01"
              min="66"
              max="100"
              value={d.lon}
              onChange={(e) => setD({ ...d, name: 'Custom point', lon: e.target.value })}
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-[0.99] transition-all"
        >
          Run Calibrated Monsoon Forecast
        </button>
      </form>
    </Card>
  )
}
