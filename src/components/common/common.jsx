import { useState } from 'react'
import { RefreshCw, Inbox, CircleAlert, Info, AlertTriangle, ShieldCheck, X } from 'lucide-react'
import { getImdAlert } from '../../utils/format'

export const Card = ({ title, subtitle, right, children, className = '' }) => (
  <section className={`rounded-lg border border-line bg-card p-5 shadow-sm ${className}`}>
    {(title || subtitle || right) && (
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-line/60 pb-3">
        <div>
          {title && <h2 className="text-base font-semibold text-fg">{title}</h2>}
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    )}
    {children}
  </section>
)

const BADGES = {
  live: ['Live model output', 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'],
  demo: ['DEMO DATA', 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-500/10'],
  historical: ['Historical evaluation', 'border-sky-600 text-sky-700 dark:text-sky-400 bg-sky-500/10'],
  benchmark: ['Benchmark Case', 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-500/10'],
}

export const SourceBadge = ({ source }) => {
  const b = BADGES[source]
  return b ? (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${b[1]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {b[0]}
    </span>
  ) : null
}

export const PageHeader = ({ title, note, source, actions }) => (
  <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
    <div>
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-fg md:text-3xl">{title}</h1>
        <SourceBadge source={source} />
      </div>
      {note && <p className="mt-1.5 max-w-3xl text-sm text-muted">{note}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </header>
)

export const Loading = ({ text = 'Loading...' }) => (
  <div role="status" aria-live="polite" className="animate-pulse rounded-lg border border-line bg-card p-6">
    <div className="mb-3 h-4 w-1/4 rounded bg-line" />
    <div className="mb-3 h-20 rounded bg-line/60" />
    <div className="h-4 w-1/2 rounded bg-line/40" />
    <p className="mt-3 text-xs text-muted">{text}</p>
  </div>
)

export const ErrorState = ({ onRetry, text = 'Unable to retrieve forecast data.' }) => (
  <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-red-500/50 bg-card p-6">
    <CircleAlert className="text-red-500" size={24} />
    <p className="text-sm font-medium">{text} Please try again.</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-md border border-line bg-card px-3.5 py-1.5 text-sm font-medium hover:border-accent hover:text-accent"
      >
        <RefreshCw size={14} /> Retry Request
      </button>
    )}
  </div>
)

export const EmptyState = ({ text }) => (
  <div className="flex items-center gap-3 rounded-lg border border-dashed border-line bg-card p-6 text-sm text-muted">
    <Inbox size={20} /> {text}
  </div>
)

// Handles loading / error / empty for any useAsync state
export function Async({ state, loading, emptyText = 'No data available.', isEmpty, errorText, children }) {
  if (state.error) return <ErrorState onRetry={state.retry} text={errorText} />
  if (!state.data) return state.loading ? <Loading text={loading} /> : <EmptyState text={emptyText} />
  if (isEmpty?.(state.data)) return <EmptyState text={emptyText} />
  return <div className={state.loading ? 'opacity-60 transition-opacity' : ''}>{children(state.data)}</div>
}

// IMD Early Warning Banner
export function IMDAlertBanner({ risk }) {
  const alert = getImdAlert(risk)
  const isHigh = alert.level === 'RED' || alert.level === 'ORANGE'

  return (
    <aside
      aria-label="Early warning alert"
      className={`relative flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${alert.borderClass} ${alert.badgeClass}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isHigh ? (
            <AlertTriangle className="h-5 w-5 text-current animate-bounce" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-current" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-xs">IMD Warning Level:</span>
            <span className="font-bold text-sm tracking-wide">{alert.level} — {alert.action}</span>
          </div>
          <p className="mt-0.5 text-xs opacity-90">{alert.description}</p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span className="inline-flex items-center gap-1 rounded bg-card/60 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
          <span className={`h-2 w-2 rounded-full ${alert.dotClass}`} />
          Active Advisory
        </span>
      </div>
    </aside>
  )
}

// Metric KPI stat card with comparative baseline
export function MetricStat({ label, value, sublabel, delta, isGood, tooltip }) {
  return (
    <div className="rounded-lg border border-line bg-card p-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        {tooltip && (
          <span title={tooltip} className="cursor-help text-muted hover:text-accent">
            <Info size={13} />
          </span>
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-fg">{value}</span>
        {delta && (
          <span className={`text-xs font-semibold ${isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {delta}
          </span>
        )}
      </div>
      {sublabel && <p className="mt-1 text-xs text-muted">{sublabel}</p>}
    </div>
  )
}

// Accessible Modal Dialog
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-line bg-card p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h3 className="font-serif text-lg font-bold text-fg">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-muted hover:bg-bg hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
