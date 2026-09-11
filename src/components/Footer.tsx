import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Brand, WhatsAppLink } from './ui'

export function Footer() {
  const [showOrder, setShowOrder] = useState(false)

  useEffect(() => {
    const heroAction = document.querySelector('.hero-copy .button')
    if (!heroAction) return
    const observer = new IntersectionObserver(([entry]) => {
      setShowOrder(!entry.isIntersecting && entry.boundingClientRect.bottom < 0)
    })
    observer.observe(heroAction)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <footer className="footer">
        <div className="container footer-main">
          <Brand />
          <p>
            Frescor de verdade.
            <br />
            Cuidado em cada pedido.
          </p>
          <a href="#inicio" className="back-top" aria-label="Voltar ao início">
            <ArrowUp size={20} />
          </a>
        </div>
        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} Casa do Morango Prime.</p>
          <a href="/credits.html" target="_blank" rel="noopener noreferrer">
            Créditos visuais
          </a>
          <span>Feito para dar gosto.</span>
        </div>
      </footer>
      <div
        className={`mobile-order ${showOrder ? 'mobile-order-visible' : ''}`}
      >
        <WhatsAppLink>Quero meus morangos</WhatsAppLink>
      </div>
    </>
  )
}
