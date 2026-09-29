import { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CloudRain,
  Wind,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Moon,
  Sun,
  Layers,
  Sparkles,
  Download,
  Volume2,
  VolumeX,
  Droplets,
} from 'lucide-react'
import useAsync from '../../hooks/useAsync'
import { useSite } from '../../hooks/useSite'
import { getHealth, DEMO_MODE, exportForecastReport, getPrediction } from '../../services/api'
import { BENCHMARK_CASES } from '../../data/mock'

const NAV = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/forecast', 'Forecast & Advisories', CloudRain],
  ['/regime', 'Weather Regime', Wind],
  ['/risk', 'Rainfall Risk', AlertTriangle],
  ['/verification', 'Verification & Skill', BarChart3],
  ['/methodology', 'Methodology & Spec', BookOpen],
]

const STATUS = {
  connected: ['API Connected', 'bg-emerald-500'],
  demo: ['Demo Simulation', 'bg-cyan-500'],
  offline: ['API Offline', 'bg-red-500'],
  checking: ['Checking API', 'bg-slate-400'],
}

function Status() {
  const s = useAsync(getHealth, [])
  const [label, dot] = STATUS[s.loading ? 'checking' : s.data ?? 'offline']
  return (
    <span role="status" className="flex items-center gap-2 text-xs text-muted font-medium">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

// Gentle Ambient Raindrop Streaks
function MonsoonRainOverlay({ active }) {
  if (!active) return null

  // Generate 26 stable pseudo-random raindrops across the viewport
  const drops = Array.from({ length: 26 }, (_, i) => ({
    id: i,
    left: `${(i * 3.8 + 2.5) % 98}%`,
    duration: `${0.9 + ((i * 7) % 10) * 0.12}s`,
    delay: `${((i * 13) % 20) * 0.1}s`,
    opacity: 0.2 + ((i * 5) % 6) * 0.08,
  }))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {drops.map((d) => (
        <div
          key={d.id}
          className="monsoon-drop"
          style={{
            left: d.left,
            animationDuration: d.duration,
            animationDelay: d.delay,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  )
}

export default function Layout({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('rg-theme') === 'dark')
  const [rainVisuals, setRainVisuals] = useState(() => localStorage.getItem('rg-monsoon-rain') !== 'false')
  const [rainAudio, setRainAudio] = useState(false)
  const audioCtxRef = useRef(null)

  const { loc, horizon, caseStudy, setCaseStudy, setLoc } = useSite()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('rg-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    localStorage.setItem('rg-monsoon-rain', rainVisuals ? 'true' : 'false')
  }, [rainVisuals])

  // Pure Web Audio Petrichor / Monsoon Rain Synthesizer
  const togglePetrichorAudio = () => {
    if (rainAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
      setRainAudio(false)
      return
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      // Generate brown/pink noise buffer
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        data[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = data[i]
        data[i] *= 2.8
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      // Gentle lowpass filter for rain-on-foliage acoustics
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(850, ctx.currentTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.05, ctx.currentTime) // soothing gentle background level

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start(0)

      setRainAudio(true)
    } catch {
      setRainAudio(false)
    }
  }

  const handleCaseChange = (caseId) => {
    if (!caseId) {
      setCaseStudy(null)
      return
    }
    setCaseStudy(caseId)
    const c = BENCHMARK_CASES[caseId]
    if (c?.loc) setLoc(c.loc)
  }

  const handleQuickExport = async () => {
    try {
      const pred = await getPrediction(loc, horizon, caseStudy)
      exportForecastReport(pred, loc, horizon)
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative min-h-screen lg:flex bg-bg text-fg overflow-x-hidden">
      {/* Monsoon Rain Atmosphere Overlay */}
      <MonsoonRainOverlay active={rainVisuals} />

      {/* Sidebar */}
      <aside className="relative z-40 border-b border-line bg-card/95 backdrop-blur-md lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r flex flex-col justify-between">
        <div>
          <div className="px-6 py-5 border-b border-line/60">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-accent flex items-center gap-1.5">
                <Droplets size={22} className="text-cyan-500 animate-pulse" />
                RituGyan
              </span>
              <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                वर्षा ऋतु
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Regime-Aware Monsoon NWP Post-Processor
            </p>
          </div>

          <nav aria-label="Main Navigation" className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
            {NAV.map(([to, name, Icon]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent/15 text-accent font-semibold shadow-xs border border-accent/30'
                      : 'text-muted hover:bg-bg hover:text-fg'
                  }`
                }
              >
                <Icon size={18} />
                <span>{name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Monsoon Atmosphere Widget at Sidebar Bottom */}
        <div className="p-4 border-t border-line/60 hidden lg:block text-xs space-y-2.5 text-muted">
          <div className="rounded-lg border border-line bg-bg/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-fg flex items-center gap-1.5">
                <CloudRain size={14} className="text-cyan-500" />
                Monsoon Vibes
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">
                {rainVisuals ? 'Rain Active' : 'Off'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setRainVisuals(!rainVisuals)}
                className={`flex-1 rounded border px-2 py-1 text-[11px] font-medium transition-colors ${
                  rainVisuals
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold'
                    : 'border-line text-muted hover:text-fg'
                }`}
              >
                {rainVisuals ? '🌧️ Rain On' : 'Dry Mode'}
              </button>

              <button
                onClick={togglePetrichorAudio}
                title="Toggle soothing petrichor rainfall sound"
                className={`rounded border p-1 text-[11px] transition-colors ${
                  rainAudio
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-500'
                    : 'border-line text-muted hover:text-fg'
                }`}
              >
                {rainAudio ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted text-center">Monsoon Circulation Modeling · RituGyan</p>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="relative z-10 min-w-0 flex-1 flex flex-col">
        {/* Top Operational Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-card/95 backdrop-blur-md px-6 py-3 shadow-2xs">
          <div className="flex items-center gap-4">
            <Status />

            {/* Scenario Picker */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-muted font-medium flex items-center gap-1">
                <Sparkles size={13} className="text-accent" />
                Monsoon Scenario:
              </span>
              <select
                value={caseStudy ?? ''}
                onChange={(e) => handleCaseChange(e.target.value || null)}
                className="rounded border border-line bg-bg px-2.5 py-1 text-xs font-medium text-fg focus:border-accent focus:outline-hidden"
              >
                <option value="">Live Simulation (Selected Station)</option>
                <option value="case_break_2024">Case: 2024 Break Spell (Foothills Flood)</option>
                <option value="case_depression_2023">Case: July 2023 Bay Depression (Odisha Deluge)</option>
                <option value="case_ghats_2023">Case: Western Ghats Orographic Surge (Konkan)</option>
                <option value="case_wd_2023">Case: July 2023 Delhi Flood (WD Synergy)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Monsoon Rain Vibe Buttons */}
            <button
              onClick={() => setRainVisuals(!rainVisuals)}
              title="Toggle monsoon rainfall effect"
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                rainVisuals
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                  : 'border-line text-muted hover:border-accent hover:text-fg'
              }`}
            >
              <CloudRain size={14} className={rainVisuals ? 'text-cyan-500 animate-bounce' : ''} />
              <span className="hidden md:inline">{rainVisuals ? 'Rain Vibes' : 'Rain Off'}</span>
            </button>

            <button
              onClick={togglePetrichorAudio}
              title="Play calming petrichor rain sound"
              className={`rounded-md border p-1.5 text-xs transition-colors ${
                rainAudio
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-500'
                  : 'border-line text-muted hover:border-accent hover:text-fg'
              }`}
            >
              {rainAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={handleQuickExport}
              title="Download Operational Forecast Brief"
              className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-accent transition-colors"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Brief</span>
            </button>

            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="rounded-md border border-line p-1.5 text-muted hover:border-accent hover:text-fg transition-colors"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Monsoon Banner Notice */}
        {caseStudy ? (
          <div className="border-b border-purple-500/40 bg-purple-500/10 px-6 py-2 text-xs text-purple-900 dark:text-purple-300 flex items-center justify-between">
            <span>
              <b>BENCHMARK SYNOPTIC CASE:</b> {BENCHMARK_CASES[caseStudy]?.name}.
            </span>
            <button
              onClick={() => handleCaseChange(null)}
              className="font-bold underline hover:text-fg ml-2"
            >
              Reset to Live
            </button>
          </div>
        ) : (
          DEMO_MODE && (
            <div className="border-b border-cyan-500/40 bg-cyan-500/10 px-6 py-1.5 text-xs text-cyan-900 dark:text-cyan-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Droplets size={13} className="text-cyan-500" />
                <b>MONSOON DOPPLER ENVIRONMENT:</b> Interactive post-processed rainfall fields & synoptic soundings across India.
              </span>
              <span className="hidden sm:inline text-[11px] opacity-80">वर्षा ऋतु विशेष संस्करण</span>
            </div>
          )
        )}

        {/* Main Content */}
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-6">{children}</main>
      </div>
    </div>
  )
}
