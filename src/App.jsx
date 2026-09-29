import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { SiteProvider } from './hooks/useSite'
import { Loading, EmptyState } from './components/common/common'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Forecast = lazy(() => import('./pages/Forecast'))
const Regime = lazy(() => import('./pages/Regime'))
const Risk = lazy(() => import('./pages/Risk'))
const Verification = lazy(() => import('./pages/Verification'))
const Methodology = lazy(() => import('./pages/Methodology'))

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <Layout>
          <Suspense fallback={<Loading text="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/regime" element={<Regime />} />
              <Route path="/risk" element={<Risk />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="*" element={<EmptyState text="Page not found." />} />
            </Routes>
          </Suspense>
        </Layout>
      </SiteProvider>
    </BrowserRouter>
  )
}
