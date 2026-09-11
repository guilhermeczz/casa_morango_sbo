import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const { VITE_SITE_URL = '' } = loadEnv(mode, process.cwd(), '')
  const origin = /^https:\/\/[a-z0-9.-]+(?::\d+)?\/?$/i.test(VITE_SITE_URL)
    ? VITE_SITE_URL.replace(/\/$/, '')
    : ''

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'site-canonical',
        transformIndexHtml: (html: string) => html.replace(
          '<!-- deployment-metadata -->',
          origin
            ? `<link rel="canonical" href="${origin}/" /><meta property="og:url" content="${origin}/" /><meta property="og:image" content="${origin}/images/og.jpg" />`
            : '',
        ),
      },
    ],
  }
})
