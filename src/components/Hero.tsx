import { ArrowDown, ArrowDownRight, MoveUpRight, Leaf } from 'lucide-react'
import { business } from '../constants/business'
import { Eyebrow, WhatsAppLink } from './ui'

export function Hero() {
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
          <span className="fruit-caption" aria-hidden="true">
            <ArrowDownRight size={29} strokeWidth={1} />
            Selecionados.
            <br />
            Um a um.
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
