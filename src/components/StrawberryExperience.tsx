import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { createStrawberryTimeline } from '../animations/strawberryTimeline'

function RealStrawberry({ reduced }: { reduced: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!track.current) return
    if (reduced) {
      const place = () => {
        const box = document.querySelector('.hero-art')!.getBoundingClientRect()
        gsap.set(track.current, {
          x: box.left + box.width / 2,
          y: box.top + window.scrollY + box.height / 2,
          xPercent: -50,
          yPercent: -50,
          width: Math.min(box.width, 510),
          height: Math.min(box.height, 580),
        })
      }
      place()
      window.addEventListener('resize', place)
      return () => window.removeEventListener('resize', place)
    }
    return createStrawberryTimeline((pose) =>
      gsap.set(track.current, {
        x: pose.x,
        y: pose.y,
        xPercent: -50,
        yPercent: -50,
        width: pose.size * 0.86,
        height: pose.size,
        rotation: pose.rotationZ * 18,
      }),
    )
  }, [reduced])
  return (
    <div ref={track} className="real-fruit-track">
      <img
        className="real-fruit-photo"
        src="/images/strawberry-real.webp"
        width="900"
        height="1080"
        alt=""
      />
    </div>
  )
}

export default function StrawberryExperience() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(media.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  return (
    <div
      className="strawberry-layer"
      style={
        reduced
          ? { position: 'absolute', height: '100%', overflow: 'clip' }
          : undefined
      }
      aria-hidden="true"
    >
      <RealStrawberry reduced={reduced} />
    </div>
  )
}
