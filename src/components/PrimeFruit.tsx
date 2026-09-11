import { useEffect, useRef } from 'react'

export function PrimeFruit({ priority = false }: { priority?: boolean }) {
  const fruit = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animation: Animation
    const start = () => {
      animation?.cancel()
      const transforms = media.matches
        ? ['translateY(-2px)', 'translateY(2px)', 'translateY(-2px)']
        : [
            'translate3d(0, -14px, 0) rotateY(-8deg) rotateZ(-3deg)',
            'translate3d(0, 14px, 20px) rotateY(8deg) rotateZ(3deg)',
            'translate3d(0, -14px, 0) rotateY(-8deg) rotateZ(-3deg)',
          ]
      animation = fruit.current!.animate(
        transforms.map((transform) => ({ transform })),
        {
          duration: 6000,
          iterations: Infinity,
          easing: 'ease-in-out',
        },
      )
    }
    start()
    media.addEventListener('change', start)
    return () => {
      animation.cancel()
      media.removeEventListener('change', start)
    }
  }, [])
  return (
    <div className="real-fruit-track" aria-hidden="true">
      <img
        ref={fruit}
        className="real-fruit-photo"
        src="/images/strawberry-prime.webp"
        width="1213"
        height="1297"
        alt=""
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  )
}
