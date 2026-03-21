import { lazy, Suspense } from 'react'

const V2Portfolio = lazy(() => import('./v2/V2Portfolio'))

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border border-[rgba(255,255,255,0.2)] border-t-white rounded-full animate-spin" />
      </div>
    }>
      <V2Portfolio />
    </Suspense>
  )
}

export default App
