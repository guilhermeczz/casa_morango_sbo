import { Gem, Leaf, Truck, BadgeCheck } from 'lucide-react'
import { Eyebrow } from './ui'

const benefits = [
  {
    icon: Gem,
    title: 'Qualidade premium',
    text: 'Selecionados com rigor. Um a um.',
  },
  {
    icon: Leaf,
    title: 'Frescor garantido',
    text: 'Frutas frescas, todos os dias.',
  },
  {
    icon: Truck,
    title: 'Entrega rápida',
    text: 'Da nossa casa para sua mesa.',
  },
  {
    icon: BadgeCheck,
    title: 'Vale cada pedido',
    text: 'Ótimo sabor. Ótimo custo-benefício.',
  },
]

export function Benefits() {
  return (
    <>
      <div className="brand-ribbon" aria-hidden="true">
        <div>
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index}>
              FRESCOR DE VERDADE<b>✳</b>CUIDADO EM CADA PEDIDO<b>✳</b>
            </span>
          ))}
        </div>
      </div>
      <section
        id="qualidade"
        className="benefits section"
        aria-labelledby="quality-title"
      >
        <div className="container">
          <div className="section-intro" data-reveal>
            <Eyebrow>O NOSSO JEITO DE FAZER</Eyebrow>
            <h2 id="quality-title">
              O cuidado muda <em>tudo.</em>
            </h2>
          </div>
          <div className="benefit-grid">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <article className="benefit" key={title} data-reveal>
                <div className="benefit-top">
                  <Icon size={28} strokeWidth={1.25} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
