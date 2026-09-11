import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Group } from 'three'

gsap.registerPlugin(ScrollTrigger)

export type StrawberryPose = { x: number; y: number; size: number; rotationX: number; rotationY: number; rotationZ: number }
type Stop = { scroll: number; pose: StrawberryPose }

// Coordinates are in CSS pixels. Both the GLB and the lightweight fallback use this path.
function getStops(): Stop[] {
  const width = window.innerWidth
  const height = window.innerHeight
  const mobile = width <= 600
  const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect()
  const docCenter = (selector: string) => { const box = rect(selector); return box.top + window.scrollY + box.height / 2 }
  const centerX = (selector: string) => { const box = rect(selector); return box.left + box.width / 2 }
  const pose = (x: number, y: number, size: number, rotationY: number, rotationZ: number): StrawberryPose => ({ x, y, size, rotationX: .3, rotationY, rotationZ })
  const heroY = docCenter('.hero-art') - 4
  const heroSize = mobile ? Math.min(355, width * .89) : Math.min(560, width * .39)
  const heroX = centerX('.hero-art') - (mobile ? 0 : 5)
  const stops: Stop[] = [{ scroll: 0, pose: pose(heroX, heroY, heroSize, -.25, -.26) }]
  if (mobile) {
    stops.push({ scroll: Math.max(1, heroY - height * .5), pose: pose(heroX, height * .5, heroSize, .08, -.14) })
  }
  const add = (selector: string, x: number, size: number, ry: number, rz: number, y = .5) => {
    stops.push({ scroll: Math.max(1, docCenter(selector) - height * y), pose: pose(x, height * y, size, ry, rz) })
  }
  add('#qualidade', width * (mobile ? 1.3 : 1.04), mobile ? 150 : 235, .48, .2, .48)
  add('#diferenca', width * (mobile ? 1.4 : 1.09), mobile ? 160 : 260, .75, .4, .6)
  if (mobile) add('.story-copy', width * 1.4, 160, .8, .1)
  add('.story-fruit-space', centerX('.story-fruit-space'), mobile ? Math.min(width * .91, 370) : Math.min(width * .43, 570), 1.05, .3, .52)
  add('.story-photo', width * -.36, mobile ? 180 : 370, 1.4, -.25, .52)
  add('#avaliacoes', width * (mobile ? 1.4 : 1.075), mobile ? 150 : 230, 1.8, -.1, .65)
  if (mobile) add('.final-copy', width * 1.4, 180, 1.95, -.2)
  add('.final-art', centerX('.final-art'), mobile ? Math.min(width * .89, 340) : Math.min(width * .37, 500), 2.25, -.35, mobile ? .47 : .45)
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - height)
  return stops.map((stop) => ({ ...stop, scroll: Math.min(maxScroll, stop.scroll) })).sort((a, b) => a.scroll - b.scroll)
}

export function createStrawberryTimeline(apply: (pose: StrawberryPose) => void) {
  let animation: gsap.core.Timeline | undefined
  const rebuild = () => {
    animation?.scrollTrigger?.kill()
    animation?.kill()
    const stops = getStops()
    const state = { ...stops[0].pose }
    apply(state)
    animation = gsap.timeline({
      onUpdate: () => apply(state),
      scrollTrigger: { start: 0, end: () => document.documentElement.scrollHeight - window.innerHeight, scrub: .65 },
      defaults: { ease: 'none' },
    })
    stops.slice(1).forEach((stop, index) => {
      const previous = stops[index].scroll
      animation!.to(state, { ...stop.pose, duration: Math.max(.001, stop.scroll - previous) }, previous)
    })
    const end = document.documentElement.scrollHeight - window.innerHeight
    if (end > stops.at(-1)!.scroll) animation.to(state, { duration: end - stops.at(-1)!.scroll })
    animation.scrollTrigger?.refresh()
    animation.progress(Math.min(1, window.scrollY / Math.max(1, end)))
  }
  rebuild()
  const resize = gsap.delayedCall(.18, rebuild).pause()
  const onResize = () => resize.restart(true)
  const onFonts = () => { if (active) rebuild() }
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

export function applyThreePose(group: Group, pose: StrawberryPose, viewport: { width: number; height: number }, screen: { width: number; height: number }) {
  group.position.set((pose.x / screen.width - .5) * viewport.width, (.5 - pose.y / screen.height) * viewport.height, 0)
  group.rotation.set(pose.rotationX, pose.rotationY, pose.rotationZ)
  // The centered model is two units tall.
  group.scale.setScalar(pose.size / screen.height * viewport.height / 2)
}
