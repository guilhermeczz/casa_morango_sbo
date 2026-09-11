import { chromium } from '@playwright/test'
import sharp from 'sharp'

// Render the same GLB used by the site. No substitute product artwork is generated.
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] })
try {
  const page = await browser.newPage({ viewport: { width: 700, height: 850 }, deviceScaleFactor: 1 })
  page.on('pageerror', (error) => console.error(error.message))
  await page.goto('http://localhost:5173/credits.html')
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent"><script type="importmap">{"imports":{"three":"http://localhost:5173/node_modules/three/build/three.module.js"}}</script><script type="module">
    import * as THREE from 'three';
    import { GLTFLoader } from 'http://localhost:5173/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
    import { RoomEnvironment } from 'http://localhost:5173/node_modules/three/examples/jsm/environments/RoomEnvironment.js';
    import { MeshoptDecoder } from 'http://localhost:5173/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js';
    const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
    renderer.setSize(700,850); renderer.setPixelRatio(1); renderer.setClearColor(0x000000,0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .95;
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),.04).texture;
    scene.add(new THREE.AmbientLight(0xffffff,.5));
    scene.add(new THREE.HemisphereLight(0xfffbef,0x6d473c,.8));
    for(const [position,intensity,color] of [[[-3,5,6],1.2,0xfff5e5],[[4,1,3],.35,0xffffff],[[0,4,-2],.7,0xfff1db]]){const light=new THREE.DirectionalLight(color,intensity);light.position.set(...position);scene.add(light)}
    const camera = new THREE.OrthographicCamera(-1.05,1.05,1.275,-1.275,.1,50); camera.position.z=10;
    const {scene:model} = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('http://localhost:5173/models/strawberry.glb');
    model.traverse(object=>{if(object.isMesh){const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>{material.roughness=.78;material.metalness=0;material.envMapIntensity=.28;material.normalScale?.set(.45,.45)})}});
    model.rotation.set(.3,-.25,-.26); scene.add(model); renderer.render(scene,camera); document.body.dataset.ready='true';
  </script></body></html>`)
  await page.waitForSelector('body[data-ready="true"]')
  await page.screenshot({ path: '.cache/strawberry-render.png', omitBackground: true })
  await sharp('.cache/strawberry-render.png').webp({ quality: 90 }).toFile('public/images/strawberry.webp')
  const fruit = await sharp('.cache/strawberry-render.png').resize(490, 595).toBuffer()
  const type = Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#f8f5ee"/><text x="70" y="95" font-family="Georgia" font-size="25" fill="#c52c38">casa do morango · PRIME</text><text x="65" y="265" font-family="Arial" font-size="88" letter-spacing="-5" fill="#282a25">Frescor real.</text><text x="65" y="370" font-family="Georgia" font-style="italic" font-size="87" letter-spacing="-4" fill="#c52c38">De verdade.</text><text x="70" y="490" font-family="Arial" font-size="20" fill="#6c6c62">Morangos selecionados. Entrega rápida.</text><text x="70" y="530" font-family="Arial" font-size="18" fill="#6c6c62">Santa Bárbara d’Oeste · SP</text></svg>`)
  await sharp(type).composite([{ input: fruit, left: 690, top: 15 }]).jpeg({ quality: 88 }).toFile('public/images/og.jpg')
  console.log('GLB render, WebP fallback and social image ready.')
} finally { await browser.close() }
