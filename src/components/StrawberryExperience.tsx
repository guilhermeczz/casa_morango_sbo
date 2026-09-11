import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { createStrawberryTimeline } from '../animations/strawberryTimeline'

const StrawberryScene = lazy(() => import('./StrawberryScene'))

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}

function StaticStrawberry({ reduced }: { reduced: boolean }) {
  const image = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (!image.current) return
    if (reduced) {
      const place = () => {
        const box = document.querySelector('.hero-art')!.getBoundingClientRect()
        gsap.set(image.current, { x: box.left + box.width / 2, y: box.top + window.scrollY + box.height / 2, xPercent: -50, yPercent: -50, width: Math.min(box.width, 540), height: Math.min(box.height, 550) })
      }
      place()
      window.addEventListener('resize', place)
      return () => window.removeEventListener('resize', place)
    }
    return createStrawberryTimeline((pose) => gsap.set(image.current, { x: pose.x, y: pose.y, xPercent: -50, yPercent: -50, width: pose.size * .88, height: pose.size, rotation: pose.rotationZ * 25 }))
  }, [reduced])
  return <img ref={image} className="fallback-fruit" src="/images/strawberry.webp" width="700" height="850" alt="" />
}

export default function StrawberryExperience() {
  const [mode, setMode] = useState<'loading' | '3d' | 'static' | 'reduced'>('loading')
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const choose = () => {
      const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
      if (media.matches) { setMode('reduced'); return }
      if (device.connection?.saveData || (device.deviceMemory && device.deviceMemory <= 2)) { setMode('static'); return }
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
        if (gl) { gl.getExtension('WEBGL_lose_context')?.loseContext(); setMode('3d') }
        else setMode('static')
      } catch { setMode('static') }
    }
    choose()
    media.addEventListener('change', choose)
    return () => media.removeEventListener('change', choose)
  }, [])
  const isStatic = mode !== '3d' || !ready
  return <div className={`strawberry-layer ${ready ? 'scene-ready' : ''}`} style={mode === 'reduced' ? { position: 'absolute', height: '100%', overflow: 'clip' } : undefined} aria-hidden="true">
    {isStatic && <StaticStrawberry reduced={mode === 'reduced' || mode === 'loading'} />}
    {mode === '3d' && <SceneBoundary onFailure={() => setMode('static')}><Suspense fallback={null}><StrawberryScene onReady={() => setReady(true)} onFailure={() => setMode('static')} /></Suspense></SceneBoundary>}
  </div>
}
