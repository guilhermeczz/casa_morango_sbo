export const business = {
  name: 'Casa do Morango Prime',
  phone: '(19) 99447-4588',
  whatsappNumber: '5519994474588',
  address: 'Rua 13 de Maio, 1229 — Centro',
  city: 'Santa Bárbara d’Oeste · SP',
  instagram: '@morangocasadomorangosbo',
  instagramUrl: 'https://www.instagram.com/morangocasadomorangosbo/',
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Casa do Morango Prime, Rua 13 de Maio, 1229, Centro, Santa Bárbara d'Oeste, SP")}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent("Casa do Morango Prime, Rua 13 de Maio, 1229, Centro, Santa Bárbara d'Oeste, SP")}&output=embed`,
} as const

export const whatsappUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent('Olá! Vim pelo site da Casa do Morango Prime e gostaria de saber mais sobre os morangos disponíveis.')}`
