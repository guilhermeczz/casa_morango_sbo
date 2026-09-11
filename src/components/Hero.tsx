import { useState } from 'react'
import {
  ArrowDown,
  ArrowDownRight,
  MoveUpRight,
  Pointer,
  RotateCcw,
  Leaf,
} from 'lucide-react'
import { business } from '../constants/business'
import { Eyebrow, WhatsAppLink } from './ui'

export function Hero() {
  const [detail, setDetail] = useState(0)
  const details = [
    'Selecionados. Um a um.',
    'Frescor em cada detalhe.',
    'Da nossa casa para a sua.',
  ]
  const interact = () => {
    setDetail((value) => (value + 1) % details.length)
    window.dispatchEvent(new CustomEvent('strawberry-turn'))
  }

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <Eyebrow>MORANGOS SELECIONADOS</Eyebrow>
          <h1 id="hero-title">
            <span>Frescor real.</span> <span>Sabor que</span> <em>encanta.</em>
          </h1>
          <p className="hero-description">
            Bonitos de ver. Incríveis de provar.
            <br /> Morangos escolhidos um a um, da nossa casa
            <br className="desktop-break" /> para a sua mesa.
          </p>
          <WhatsAppLink>Quero meus morangos</WhatsAppLink>
          <p className="hero-service">
            <span />
            Atacado & varejo<span className="service-divider">/</span>Entrega
            rápida
          </p>
          <a className="hero-story-link" href="#cuidado">
            <img
              src="/images/strawberries.webp"
              alt=""
              width="64"
              height="64"
            />
            <span>
              O simples pode ser <em>extraordinário.</em>
              <small>
                Conheça o nosso cuidado
                <MoveUpRight size={13} />
              </small>
            </span>
          </a>
        </div>
        <div className="hero-art">
          <span className="hero-edition">
            NATUREZA CAPRICHOU.
            <br />A GENTE SELECIONOU.
          </span>
          <span className="hero-watermark" aria-hidden="true">
            prime.
          </span>
          <div className="hero-orbit" aria-hidden="true" />
          <span className="hero-art-label">
            <Leaf size={14} strokeWidth={1.5} />
            Naturalmente irresistível.
          </span>
          <button
            className="fruit-interaction"
            onClick={interact}
            aria-label="Girar o morango 3D e descobrir um detalhe"
            onPointerMove={(event) => {
              if (event.pointerType !== 'mouse') return
              const rect = event.currentTarget.getBoundingClientRect()
              window.dispatchEvent(
                new CustomEvent('strawberry-pointer', {
                  detail: {
                    x: (event.clientX - rect.left) / rect.width - 0.5,
                    y: (event.clientY - rect.top) / rect.height - 0.5,
                  },
                }),
              )
            }}
            onPointerLeave={() =>
              window.dispatchEvent(
                new CustomEvent('strawberry-pointer', {
                  detail: { x: 0, y: 0 },
                }),
              )
            }
          >
            <span className="interaction-hint">
              <Pointer size={15} />
              Toque. Gire. Descubra.
              <RotateCcw size={13} />
            </span>
          </button>
          <span className="fruit-caption" aria-live="polite">
            <ArrowDownRight size={29} strokeWidth={1} />
            {details[detail]}
          </span>
          <div
            className="selection-seal"
            aria-label="Seleção Prime, frescor de verdade"
          >
            <span>SELEÇÃO</span>
            <span className="seal-star" aria-hidden="true">
              ✳
            </span>
            <span>PRIME</span>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#qualidade" className="scroll-cue">
            <span>
              <ArrowDown size={17} />
            </span>
            Um bom gosto para descobrir
          </a>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-location"
          >
            SANTA BÁRBARA D’OESTE, SP
            <MoveUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
