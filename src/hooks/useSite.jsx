import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export const SiteProvider = ({ children }) => {
  const [loc, setLoc] = useState({ name: 'Bhubaneswar (Odisha)', lat: 20.3, lon: 85.8 })
  const [horizon, setHorizon] = useState('24h') // '24h' | '48h' | '72h' | '120h'
  const [caseStudy, setCaseStudy] = useState(null) // null | 'case_break_2024' | etc.
  const [customThreshold, setCustomThreshold] = useState(64.5)

  return (
    <Ctx.Provider
      value={{
        loc,
        setLoc,
        horizon,
        setHorizon,
        caseStudy,
        setCaseStudy,
        customThreshold,
        setCustomThreshold,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useSite = () => useContext(Ctx)
