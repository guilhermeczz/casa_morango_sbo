import { readFile, writeFile } from 'node:fs/promises'
import { gunzipSync } from 'node:zlib'

const paths = JSON.parse(gunzipSync(await readFile('.cache/object-paths.json.gz')))
for (const uid of ['dd6a424807614544835c8cc4529d6f0d', '0b9867d98c154737b422fa5afacfc178', 'fa37cfb2764f497ca0b07e27870eec4d', '0cbb98225b814aadafdffba55bd6c9fd']) {
  const shard = paths[uid].split('/')[1]
  const meta = JSON.parse(gunzipSync(await readFile(`.cache/${shard}.json.gz`)))[uid]
  const thumb = meta.thumbnails.images.find((image) => image.width >= 720)
  const response = await fetch(thumb.url)
  if (!response.ok) throw new Error(`Thumbnail: ${response.status}`)
  await writeFile(`.cache/${uid}.jpg`, Buffer.from(await response.arrayBuffer()))
  console.log(uid, meta.name, meta.description)
}
