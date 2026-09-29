import { useEffect, useState } from 'react'
// Keeps previous data while re-fetching (no flash when location changes).
export default function useAsync(fn, deps = []) {
  const [s, set] = useState({ data: null, loading: true, error: null })
  const [n, setN] = useState(0)
  useEffect(() => {
    let live = true
    set((x) => ({ ...x, loading: true, error: null }))
    fn().then((data) => live && set({ data, loading: false, error: null }))
        .catch((error) => live && set({ data: null, loading: false, error }))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, n])
  return { ...s, retry: () => setN((x) => x + 1) }
}
