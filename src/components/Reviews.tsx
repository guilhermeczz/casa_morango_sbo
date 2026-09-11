import { Star, Quote } from 'lucide-react'
import { Eyebrow } from './ui'

const reviews = [
  'Lugar que tem morango fresco todo dia. De qualidade. Atacado e varejo.',
  'Gostaria de agradecer pela entrega de ontem. Há tempos procurava morango com essa qualidade e não encontrava. Fiquei muito satisfeita com meu pedido e com certeza comprarei novamente.',
  'Olha a perfeição para ir para o recheio do bolo. Não tinha nenhum estragado ❤️',
]

export function Reviews() {
  return (
    <section
      id="avaliacoes"
      className="reviews section"
      aria-labelledby="reviews-title"
    >
      <div className="container">
        <div className="reviews-intro" data-reveal>
          <div>
            <Eyebrow>PALAVRAS DE QUEM JÁ PROVOU</Eyebrow>
            <h2 id="reviews-title">
              Quem compra,
              <br /> <em>percebe.</em>
            </h2>
          </div>
          <p>
            A qualidade também aparece
            <br /> nas avaliações.
          </p>
        </div>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <figure className="review" key={review} data-reveal>
              <div className="review-stars" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden="true"
                  />
                ))}
                <Quote size={23} strokeWidth={1} aria-hidden="true" />
              </div>
              <blockquote>“{review}”</blockquote>
              <figcaption>
                <span className="review-avatar" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  Cliente Casa do Morango
                  <small>Depoimento real de cliente</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
