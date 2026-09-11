import { ArrowUpRight } from 'lucide-react'
import { Eyebrow } from './ui'
import { whatsappUrl } from '../constants/business'
import { PrimeFruit } from './PrimeFruit'

export function ProductStory() {
  return (
    <section
      id="cuidado"
      className="product-story section"
      aria-labelledby="story-title"
    >
      <div className="container story-grid">
        <div className="story-fruit-space" aria-hidden="true">
          <PrimeFruit />
          <span className="story-watermark">
            puro
            <br />
            cuidado.
          </span>
          <span className="story-fruit-note">
            Pequenos detalhes.
            <br />
            Uma grande diferença.
          </span>
        </div>
        <div className="story-copy" data-reveal>
          <Eyebrow>DO PRIMEIRO OLHAR À PRIMEIRA MORDIDA</Eyebrow>
          <h2 id="story-title">
            Não é só
            <br /> <em>morango.</em>
          </h2>
          <div className="story-steps">
            <p>
              <span>01</span>É selecionar.
            </p>
            <p>
              <span>02</span>É cuidar.
            </p>
            <p>
              <span>03</span>É entregar fresco.
            </p>
          </div>
          <p className="story-description">
            Para o seu café da manhã.
            <br />
            Para aquela receita especial.
            <br />
            Para deixar o dia mais gostoso.
          </p>
          <a
            href={whatsappUrl}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Da nossa casa para a sua
            <ArrowUpRight size={19} />
          </a>
        </div>
      </div>
    </section>
  )
}
