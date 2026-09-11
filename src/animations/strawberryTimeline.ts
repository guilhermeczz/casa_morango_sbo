import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type StrawberryPose = {
  x: number
  y: number
  size: number
  rotationX: number
  rotationY: number
  rotationZ: number
}
type Stop = { scroll: number; pose: StrawberryPose }

// Coordinates are in CSS pixels. Both the GLB and the lightweight fallback use this path.
function getStops(): Stop[] {
  const width = window.innerWidth
  const height = window.innerHeight
  const mobile = width <= 600
  const rect = (selector: string) =>
    document.querySelector(selector)!.getBoundingClientRect()
  const docCenter = (selector: string) => {
    const box = rect(selector)
    return box.top + window.scrollY + box.height / 2
  }
  const centerX = (selector: string) => {
    const box = rect(selector)
    return box.left + box.width / 2
  }
  const pose = (
    x: number,
    y: number,
    size: number,
    rotationY: number,
    rotationZ: number,
  ): StrawberryPose => ({ x, y, size, rotationX: 0.3, rotationY, rotationZ })
  const heroY = docCenter('.hero-art') - 4
  const heroSize = mobile
    ? Math.min(355, width * 0.89)
    : Math.min(560, width * 0.39, height * 0.82)
  const heroX = centerX('.hero-art') - (mobile ? 0 : 5)
  const stops: Stop[] = [
    { scroll: 0, pose: pose(heroX, heroY, heroSize, -0.25, -0.26) },
  ]
  if (mobile) {
    stops.push({
      scroll: Math.max(1, heroY - height * 0.5),
      pose: pose(heroX, height * 0.5, heroSize, 0.08, -0.14),
    })
  }
  const add = (
    selector: string,
    x: number,
    size: number,
    ry: number,
    rz: number,
    y = 0.5,
  ) => {
    stops.push({
      scroll: Math.max(1, docCenter(selector) - height * y),
      pose: pose(x, height * y, size, ry, rz),
    })
  }
  add(
    '#qualidade',
    width * (mobile ? 1.3 : 1.04),
    mobile ? 150 : 235,
    0.48,
    0.2,
    0.48,
  )
  add(
    '#diferenca',
    width * (mobile ? 1.4 : 1.09),
    mobile ? 160 : 260,
    0.75,
    0.4,
    0.6,
  )
  if (mobile) add('.story-copy', width * 1.4, 160, 0.8, 0.1)
  add(
    '.story-fruit-space',
    centerX('.story-fruit-space'),
    mobile ? Math.min(width * 0.91, 370) : Math.min(width * 0.43, 570),
    1.05,
    0.3,
    0.52,
  )
  add('.story-photo', width * -0.36, mobile ? 180 : 370, 1.4, -0.25, 0.52)
  add(
    '#avaliacoes',
    width * (mobile ? 1.4 : 1.075),
    mobile ? 150 : 230,
    1.8,
    -0.1,
    0.65,
  )
  if (mobile) add('.final-copy', width * 1.4, 180, 1.95, -0.2)
  add(
    '.final-fruit-space',
    centerX('.final-fruit-space'),
    mobile ? Math.min(width * 0.78, 300) : Math.min(width * 0.27, 350),
    2.25,
    -0.35,
    mobile ? 0.47 : 0.45,
  )
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - height)
  return stops
    .map((stop) => ({ ...stop, scroll: Math.min(maxScroll, stop.scroll) }))
    .sort((a, b) => a.scroll - b.scroll)
}

export function createStrawberryTimeline(
  apply: (pose: StrawberryPose) => void,
) {
  let animation: gsap.core.Timeline | undefined
  const rebuild = () => {
    animation?.scrollTrigger?.kill()
    animation?.kill()
    const stops = getStops()
    const state = { ...stops[0].pose }
    apply(state)
    animation = gsap.timeline({
      onUpdate: () => apply(state),
      scrollTrigger: {
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        scrub: 0.65,
      },
      defaults: { ease: 'none' },
    })
    stops.slice(1).forEach((stop, index) => {
      const previous = stops[index].scroll
      animation!.to(
        state,
        { ...stop.pose, duration: Math.max(0.001, stop.scroll - previous) },
        previous,
      )
    })
    const end = document.documentElement.scrollHeight - window.innerHeight
    if (end > stops.at(-1)!.scroll)
      animation.to(state, { duration: end - stops.at(-1)!.scroll })
    animation.scrollTrigger?.refresh()
    animation.progress(Math.min(1, window.scrollY / Math.max(1, end)))
  }
  rebuild()
  const resize = gsap.delayedCall(0.18, rebuild).pause()
  const onResize = () => resize.restart(true)
  const onFonts = () => {
    if (active) rebuild()
  }
  let active = true
  document.fonts.ready.then(onFonts)
  window.addEventListener('resize', onResize)
  return () => {
    active = false
    window.removeEventListener('resize', onResize)
    resize.kill()
    animation?.scrollTrigger?.kill()
    animation?.kill()
  }
}
