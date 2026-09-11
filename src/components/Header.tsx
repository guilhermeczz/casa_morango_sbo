import { useEffect, useRef, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Brand, WhatsAppLink } from './ui'
import { whatsappUrl } from '../constants/business'

const links = [
  ['Início', '#inicio'],
  ['Qualidade', '#qualidade'],
  ['Avaliações', '#avaliacoes'],
  ['Localização', '#localizacao'],
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    const wide = window.matchMedia('(min-width: 900px)')
    const onWide = () => {
      if (wide.matches) setOpen(false)
    }
    window.addEventListener('keydown', close)
    window.addEventListener('pointerdown', outside)
    wide.addEventListener('change', onWide)
    return () => {
      window.removeEventListener('keydown', close)
      window.removeEventListener('pointerdown', outside)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <header
      ref={header}
      className={`header ${scrolled ? 'header-scrolled' : ''}`}
    >
      <div className="container header-inner">
        <Brand />
        <nav aria-label="Navegação principal" className="desktop-nav">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <WhatsAppLink className="header-cta" />
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Navegação para celular"
        >
          {links.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              {label}
              <ArrowUpRight size={20} />
            </a>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Pedir pelo WhatsApp
            <ArrowUpRight size={20} />
          </a>
        </nav>
      )}
    </header>
  )
}
