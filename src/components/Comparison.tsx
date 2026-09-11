import { useState } from 'react'
import { ArrowUpRight, Check, SlidersHorizontal } from 'lucide-react'
import { Eyebrow } from './ui'
import { whatsappUrl } from '../constants/business'

export function Comparison() {
  const [position, setPosition] = useState(52)
  return (
    <section
      id="diferenca"
      className="comparison section"
      aria-labelledby="comparison-title"
    >
      <div className="container comparison-grid">
        <div className="comparison-copy" data-reveal>
          <Eyebrow>É SÓ OLHAR DE PERTO</Eyebrow>
          <h2 id="comparison-title">
            Veja a<br /> <em>diferença.</em>
          </h2>
          <p>
            Tem morango. E tem aquele morango
            <br />
            que você escolhe com os olhos.
          </p>
          <ul className="check-list">
            {[
              'Mais graúdos e bonitos',
              'Selecionados, com aparência uniforme',
              'Frescos para comer e criar receitas',
            ].map((text) => (
              <li key={text}>
                <Check size={16} />
                {text}
              </li>
            ))}
          </ul>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Quero experimentar
            <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="comparison-visual" data-reveal>
          <div className="comparison-stage">
            <div className="comparison-side common-side">
              <span className="comparison-label">SELEÇÃO VARIÁVEL</span>
              <img
                src="/images/strawberry.webp"
                alt="Representação de um morango menor para ilustrar a comparação"
                width="700"
                height="850"
                loading="lazy"
              />
            </div>
            <div
              className="comparison-side prime-side"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <span className="comparison-label">
                CASA DO MORANGO PRIME<span>✳</span>
              </span>
              <img
                src="/images/strawberry.webp"
                alt="Representação de um morango graúdo e selecionado"
                width="700"
                height="850"
                loading="lazy"
              />
            </div>
            <div
              className="comparison-divider"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            >
              <span>
                <SlidersHorizontal size={20} />
              </span>
            </div>
            <input
              className="comparison-range"
              type="range"
              min="10"
              max="90"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label="Arraste para comparar a seleção Prime com uma seleção variável"
              aria-valuetext={`${position}% da seleção Prime visível`}
            />
            <div className="comparison-bottom" aria-hidden="true">
              <span>ESCOLHIDOS UM A UM</span>
              <span>QUALIDADE VARIÁVEL</span>
            </div>
          </div>
          <p className="comparison-note">
            <span>↔ Arraste para comparar</span>Comparação ilustrativa. Tamanho
            e aparência variam conforme o lote. Produtos de mercado também podem
            ter alta qualidade.
          </p>
        </div>
      </div>
    </section>
  )
}
