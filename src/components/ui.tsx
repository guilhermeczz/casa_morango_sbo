import { ArrowUpRight, MessageCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { whatsappUrl } from '../constants/business'

export function WhatsAppLink({ children = 'Pedir pelo WhatsApp', className = '' }: { children?: ReactNode; className?: string }) {
  return <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`button ${className}`}>
    <MessageCircle size={19} strokeWidth={1.7} aria-hidden="true" />
    <span>{children}</span><ArrowUpRight size={18} aria-hidden="true" />
  </a>
}

export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="#inicio" aria-label="Casa do Morango Prime — início">
    <span className="brand-mark" aria-hidden="true">m<span>✳</span></span>
    <span className="brand-name">casa do morango<span>PRIME</span></span>
  </a>
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span aria-hidden="true" />{children}</p>
}
