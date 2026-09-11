import { ArrowUpRight, Instagram, MapPin } from 'lucide-react'
import { Eyebrow, WhatsAppLink } from './ui'
import { business } from '../constants/business'

export function FinalCTA() {
  return (
    <section
      id="localizacao"
      className="final-cta section"
      aria-labelledby="cta-title"
    >
      <div className="container final-grid">
        <div className="final-copy" data-reveal>
          <Eyebrow light>SEU PRÓXIMO BOM GOSTO COMEÇA AQUI</Eyebrow>
          <h2 id="cta-title">
            Prove a<br /> <em>diferença.</em>
          </h2>
          <p>
            Morangos selecionados, frescos
            <br /> e entregues para você.
          </p>
          <WhatsAppLink className="button-cream">
            Quero pedir meus morangos
          </WhatsAppLink>
          <a className="final-phone" href={`tel:+${business.whatsappNumber}`}>
            {business.phone}
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="final-side">
          <div className="final-fruit-space" aria-hidden="true">
            <span>
              bom
              <br />
              demais.
            </span>
          </div>
          <div className="final-map" data-reveal>
            <iframe
              src={business.mapsEmbedUrl}
              title="Localização da Casa do Morango Prime"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="map-details">
              <MapPin size={20} />
              <span>
                {business.address}
                <small>{business.city}</small>
              </span>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir rota no Google Maps"
              >
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="contact-row">
          <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin size={23} strokeWidth={1.3} />
            <span>
              Como chegar<small>Abra a rota no Google Maps</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={23} strokeWidth={1.3} />
            <span>
              Acompanhe o frescor por aqui<small>{business.instagram}</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  )
}
