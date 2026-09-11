import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { gunzipSync } from 'node:zlib'
import path from 'node:path'

const root = process.cwd()
const cache = path.join(root, '.cache')
await mkdir(cache, { recursive: true })
for (const dir of ['models', 'images', 'fonts']) await mkdir(path.join(root, 'public', dir), { recursive: true })

async function download(url, target, refresh = false) {
  if (!refresh) { try { await access(target); return await readFile(target) } catch { /* Download once. */ } }
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  await writeFile(target, bytes)
  return bytes
}

const base = 'https://huggingface.co/datasets/allenai/objaverse/resolve/main/'
const paths = JSON.parse(gunzipSync(await download(`${base}object-paths.json.gz`, path.join(cache, 'object-paths.json.gz'))))
const labels = JSON.parse(gunzipSync(await download(`${base}lvis-annotations.json.gz`, path.join(cache, 'lvis.json.gz'))))
console.log('Strawberry models:', JSON.stringify(labels.strawberry))
const candidates = ['dd6a424807614544835c8cc4529d6f0d']
for (const uid of candidates) console.log(uid, paths[uid] ?? 'not in collection')
const uid = candidates.find((id) => paths[id])
if (!uid) {
  const ids = labels.strawberry ?? []
  for (const id of ids) {
    const shard = paths[id].split('/')[1]
    const meta = JSON.parse(gunzipSync(await download(`${base}metadata/${shard}.json.gz`, path.join(cache, `${shard}.json.gz`))))[id]
    console.log(JSON.stringify({ uid: id, name: meta.name, license: meta.license, faces: meta.faceCount, user: meta.user?.displayName, thumbnails: meta.thumbnails?.images?.slice(0, 1) }))
  }
  throw new Error('Review listed alternatives.')
}
const modelPath = paths[uid]
const shard = modelPath.split('/')[1]
const metadata = JSON.parse(gunzipSync(await download(`${base}metadata/${shard}.json.gz`, path.join(cache, `${shard}.json.gz`))))
const entry = metadata[uid]
await writeFile(path.join(cache, 'model-metadata.json'), JSON.stringify(entry, null, 2))
console.log('Metadata:', JSON.stringify({ uid, name: entry.name, license: entry.license, user: entry.user, faceCount: entry.faceCount }))
const license = typeof entry.license === 'string' ? entry.license : entry.license?.slug ?? entry.license?.label ?? ''
if (!['by', 'cc0', 'CC0', 'CC Attribution'].includes(license)) throw new Error(`License needs review: ${license}`)
const model = await download(`${base}${modelPath}`, path.join(cache, `${uid}.glb`))
await writeFile(path.join(cache, 'strawberry-original.glb'), model)
console.log('Original downloaded.')

for (const [name, family] of [['dm-sans', 'DM+Sans:wght@100..1000'], ['fraunces', 'Fraunces:opsz,wght@9..144,100..900']]) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}&display=swap`, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } })).text()
  const latin = css.split('/* latin */').at(-1)
  const url = latin.match(/url\((https:[^)]+)\)/)?.[1]
  if (!url) throw new Error(`Missing font ${name}`)
  await download(url, path.join(root, 'public', 'fonts', `${name}-latin.woff2`), true)
  await download(`https://raw.githubusercontent.com/google/fonts/main/ofl/${name.replaceAll('-', '')}/OFL.txt`, path.join(root, 'public', 'fonts', `${name}-LICENSE.txt`))
}
await download('https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=85', path.join(cache, 'strawberries-stock.jpg'))
console.log('Fonts and reference photo ready.')
