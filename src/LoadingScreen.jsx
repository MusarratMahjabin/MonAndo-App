import { useEffect } from 'react'

function LoadingScreen({ onLoaded }) {
  useEffect(() => {
    const timer = setTimeout(onLoaded, 1200)
    return () => clearTimeout(timer)
  }, [onLoaded])

  return (
    <div className="loading-screen">
      <span className="loading-pulse" />
      <p className="loading-text">Entering scene…</p>
    </div>
  )
}

export default LoadingScreen
