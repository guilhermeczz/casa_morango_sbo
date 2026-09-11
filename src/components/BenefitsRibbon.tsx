import { useEffect, useRef, useState } from 'react'

const items = [
  'Cuidado em cada pedido',
  'Frescor de verdade',
  'Entrega rápida',
  'Seleção Prime',
  'Atacado e varejo',
  'Perto de você',
]

export function BenefitsRibbon() {
  const track = useRef<HTMLDivElement>(null)
  const group = useRef<HTMLDivElement>(null)
  const animation = useRef<Animation | null>(null)
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const paused = focused || hovered

  useEffect(() => {
    const element = track.current!
    const sequence = group.current!
    const rebuild = () => {
      const old = animation.current
      const duration = Number(old?.effect?.getTiming().duration) || 1
      const progress = (Number(old?.currentTime ?? 0) % duration) / duration
      const wasPaused = old?.playState === 'paused'
      old?.cancel()
      const distance = sequence.getBoundingClientRect().width
      if (!distance) return
      // Move one exact repeated group right at a constant 48 CSS pixels/s.
      const next = element.animate(
        [
          { transform: `translate3d(${-distance}px, 0, 0)` },
          { transform: 'translate3d(0, 0, 0)' },
        ],
        {
          duration: (distance / 48) * 1000,
          iterations: Infinity,
          easing: 'linear',
        },
      )
      next.currentTime = ((progress * distance) / 48) * 1000
      if (wasPaused) next.pause()
      animation.current = next
    }
    const observer = new ResizeObserver(rebuild)
    observer.observe(sequence)
    rebuild()
    return () => {
      observer.disconnect()
      animation.current?.cancel()
    }
  }, [])

  useEffect(() => {
    if (paused) animation.current?.pause()
    else animation.current?.play()
  }, [paused])

  return (
    <section
      className="brand-ribbon"
      aria-label="Benefícios da Casa do Morango Prime"
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="ribbon-window">
        <div ref={track} className="ribbon-track">
          {[0, 1].map((copy) => (
            <div
              ref={copy === 0 ? group : undefined}
              className="ribbon-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {items.map((item) => (
                <span className="ribbon-item" key={item}>
                  {item}
                  <b aria-hidden="true">✳</b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
