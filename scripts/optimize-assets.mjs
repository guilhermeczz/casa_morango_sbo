import { NodeIO } from '@gltf-transform/core'
import { dedup, prune, weld, simplify, center, getBounds, metalRough, meshopt } from '@gltf-transform/functions'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptSimplifier, MeshoptEncoder } from 'meshoptimizer'
import sharp from 'sharp'
import { stat } from 'node:fs/promises'

await MeshoptSimplifier.ready
await MeshoptEncoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder })
for (const [name, ratio, resolution] of [['strawberry', .45, 1024], ['strawberry-mobile', .25, 512]]) {
  const doc = await io.read('.cache/strawberry-original.glb')
  await doc.transform(metalRough(), dedup(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio, error: .002 }), prune(), center())
  const root = doc.getRoot()
  const normalization = doc.createNode('Normalized strawberry')
  const scene = root.listScenes()[0]
  for (const node of scene.listChildren()) { scene.removeChild(node); normalization.addChild(node) }
  scene.addChild(normalization)
  const bounds = getBounds(scene)
  const scale = 2 / (bounds.max[1] - bounds.min[1])
  normalization.setScale([scale, scale, scale])
  for (const texture of root.listTextures()) {
    const data = await sharp(texture.getImage()).resize(resolution, resolution, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 86 }).toBuffer()
    texture.setImage(data).setMimeType('image/jpeg')
  }
  for (const material of root.listMaterials()) {
    material.setExtension('KHR_materials_ior', null)
    material.setExtension('KHR_materials_specular', null)
    material.setMetallicFactor(0).setRoughnessFactor(.42)
  }
  root.getAsset().copyright = 'Strawberry by gelmi.com.br — CC BY 4.0. Optimized for Casa do Morango Prime.'
  console.log('Bounds', JSON.stringify(getBounds(root.listScenes()[0])))
  const file = `public/models/${name}.glb`
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
  await io.write(file, doc)
  console.log(file, (await stat(file)).size, 'bytes')
}
await sharp('.cache/strawberries-stock.jpg').resize(1200, 800, { fit: 'cover' }).webp({ quality: 82 }).toFile('public/images/strawberries.webp')
console.log('Product photo optimized.')
