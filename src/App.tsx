import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Benefits } from './components/Benefits'
import { Comparison } from './components/Comparison'
import { ProductStory } from './components/ProductStory'
import { Reviews } from './components/Reviews'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { BenefitsRibbon } from './components/BenefitsRibbon'

gsap.registerPlugin(ScrollTrigger)
export default function App() {
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const elements = main.current?.querySelectorAll('[data-reveal]') ?? []
      elements.forEach((element) =>
        gsap.from(element, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        }),
      )
    })
    return () => media.revert()
  }, [])

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main ref={main} id="conteudo">
        <Hero />
        <BenefitsRibbon />
        <Reviews />
        <Comparison />
        <ProductStory />
        <Benefits />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
