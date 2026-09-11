import { ArrowUpRight, Check, Minus, Sparkles } from 'lucide-react'
import { Eyebrow } from './ui'
import { whatsappUrl } from '../constants/business'

const primeQualities = [
  'Escolhidos um a um',
  'Aparência mais uniforme',
  'Frescor e cuidado no pedido',
]
const variableQualities = [
  'Tamanho pode variar',
  'Sem curadoria individual',
  'Qualidade depende do lote',
]

export function Comparison() {
  return (
    <section
      id="diferenca"
      className="comparison section"
      aria-labelledby="comparison-title"
    >
      <div className="container">
        <div className="comparison-heading" data-reveal>
          <div className="comparison-copy">
            <Eyebrow>É SÓ OLHAR DE PERTO</Eyebrow>
            <h2 id="comparison-title">
              A diferença está na <em>seleção.</em>
            </h2>
          </div>
          <p>
            Na Casa do Morango Prime, cada fruta passa pelo olhar de quem
            entende de frescor, beleza e sabor.
          </p>
        </div>

        <div className="comparison-showcase" data-reveal>
          <article className="choice-card prime-choice">
            <span className="choice-badge">
              <Sparkles size={14} />
              SELEÇÃO PRIME
            </span>
            <div className="choice-image">
              <img
                src="/images/strawberry-real.webp"
                alt="Fotografia de um morango selecionado da categoria Prime"
                width="900"
                height="1080"
                loading="lazy"
              />
            </div>
            <div className="choice-copy">
              <small>CASA DO MORANGO PRIME</small>
              <h3>Qualidade que dá para ver.</h3>
              <p>
                Frutas escolhidas com cuidado para chegar bonitas, frescas e
                prontas para aproveitar.
              </p>
              <ul>
                {primeQualities.map((quality) => (
                  <li key={quality}>
                    <Check size={16} />
                    {quality}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <span className="comparison-versus" aria-hidden="true">
            VS
          </span>

          <article className="choice-card variable-choice">
            <span className="choice-badge">SELEÇÃO VARIÁVEL</span>
            <div className="choice-image">
              <img
                src="/images/strawberries.webp"
                alt="Fotografia ilustrativa de um lote de morangos com aparência variada"
                width="1200"
                height="800"
                loading="lazy"
              />
            </div>
            <div className="choice-copy">
              <small>SEM CURADORIA PRIME</small>
              <h3>O resultado pode variar.</h3>
              <p>
                Sem uma seleção cuidadosa, tamanho, aparência e conservação
                podem mudar a cada compra.
              </p>
              <ul>
                {variableQualities.map((quality) => (
                  <li key={quality}>
                    <Minus size={16} />
                    {quality}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <div className="comparison-action" data-reveal>
          <p>
            Fotografias ilustrativas. Tamanho e aparência variam conforme o
            lote.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Quero a Seleção Prime
            <ArrowUpRight size={19} />
          </a>
        </div>
      </div>
    </section>
  )
}
