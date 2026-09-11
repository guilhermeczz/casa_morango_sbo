import { ArrowDown, MoveUpRight, Star } from 'lucide-react'
import { business } from '../constants/business'
import { Eyebrow, WhatsAppLink } from './ui'

export function Hero() {
  return (
    <section
      id="inicio"
      className="hero hero-reference"
      aria-labelledby="hero-title"
    >
      <div className="hero-leaves" aria-hidden="true">
        <span className="hero-leaf hero-leaf-left" />
        <span className="hero-leaf hero-leaf-right" />
        <span className="hero-leaf hero-leaf-bottom" />
      </div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <Eyebrow>MORANGOS SELECIONADOS</Eyebrow>
          <h1 id="hero-title">
            <span>Frescor real</span>
            <em>em cada entrega.</em>
          </h1>
          <p className="hero-description">
            Morangos frescos, doces e de qualidade excepcional. Direto da nossa
            casa para a sua mesa em Santa Bárbara d’Oeste – SP.
          </p>
          <WhatsAppLink>Pedir agora no WhatsApp</WhatsAppLink>
          <a className="hero-reviews-link" href="#avaliacoes">
            <span className="hero-review-stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={15}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </span>
            <span>
              Quem já provou, recomenda.
              <small>
                Veja as avaliações dos nossos clientes <MoveUpRight size={13} />
              </small>
            </span>
          </a>
        </div>
        <div className="hero-art">
          <div className="real-fruit-track">
            <img
              className="real-fruit-photo"
              src="/images/hero-inspiration.webp"
              alt="Composição ilustrativa de um morango graúdo com fatias, folhas verdes e gotas de frescor"
              width="1254"
              height="1254"
              fetchPriority="high"
              draggable={false}
            />
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#avaliacoes" className="scroll-cue">
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
            SANTA BÁRBARA D’OESTE, SP <MoveUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
