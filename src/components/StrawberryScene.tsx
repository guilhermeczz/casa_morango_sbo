import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group, Mesh, MeshStandardMaterial, ACESFilmicToneMapping, PMREMGenerator } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { gsap } from 'gsap'
import { applyThreePose, createStrawberryTimeline } from '../animations/strawberryTimeline'

function Strawberry({ onReady }: { onReady: () => void }) {
  const mobile = window.matchMedia('(max-width: 600px)').matches
  const { scene } = useGLTF(mobile ? '/models/strawberry-mobile.glb' : '/models/strawberry.glb')
  const rig = useRef<Group>(null)
  const interaction = useRef<Group>(null)
  const { viewport, size, invalidate, gl, scene: world } = useThree()
  const dimensions = useRef({ viewport, size })
  dimensions.current = { viewport, size }

  useEffect(() => {
    const room = new RoomEnvironment()
    const generator = new PMREMGenerator(gl)
    const environment = generator.fromScene(room, .04)
    world.environment = environment.texture
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (material instanceof MeshStandardMaterial) {
            material.envMapIntensity = .28
            material.metalness = 0
            material.roughness = .78
            material.normalScale.set(.45, .45)
            if (material.map) material.map.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
          }
        })
      }
    })
    onReady()
    invalidate()
    return () => { world.environment = null; environment.dispose(); generator.dispose(); room.dispose() }
  }, [scene, world, gl, invalidate, onReady])

  useEffect(() => {
    const dispose = createStrawberryTimeline((pose) => {
      if (!rig.current) return
      applyThreePose(rig.current, pose, dimensions.current.viewport, dimensions.current.size)
      invalidate()
    })
    const rotate = () => {
      if (!interaction.current) return
      gsap.to(interaction.current.rotation, { y: '+=1.05', duration: 1.15, ease: 'power2.inOut', overwrite: 'auto', onUpdate: invalidate })
    }
    const point = (event: Event) => {
      if (!interaction.current) return
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail
      gsap.to(interaction.current.rotation, { x: y * .22, z: -x * .16, duration: .7, ease: 'power2.out', overwrite: 'auto', onUpdate: invalidate })
    }
    const visible = () => { if (!document.hidden) invalidate() }
    window.addEventListener('strawberry-turn', rotate)
    window.addEventListener('strawberry-pointer', point)
    document.addEventListener('visibilitychange', visible)
    const rotation = interaction.current?.rotation
    return () => {
      dispose()
      if (rotation) gsap.killTweensOf(rotation)
      window.removeEventListener('strawberry-turn', rotate)
      window.removeEventListener('strawberry-pointer', point)
      document.removeEventListener('visibilitychange', visible)
    }
  }, [invalidate])

  return <group ref={rig}><group ref={interaction}><primitive object={scene} /></group></group>
}

export default function StrawberryScene({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const mobile = window.matchMedia('(max-width: 600px)').matches
  return <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 100, near: .1, far: 50 }} dpr={mobile ? [1, 1.25] : [1, 1.6]} frameloop="demand" gl={{ alpha: true, antialias: !mobile, powerPreference: 'low-power', toneMapping: ACESFilmicToneMapping, toneMappingExposure: .95 }} onCreated={({ gl }) => {
    gl.setClearColor(0x000000, 0)
    gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true })
  }}>
    <ambientLight intensity={.5} />
    <hemisphereLight args={['#fffbef', '#6d473c', .8]} />
    <directionalLight position={[-3, 5, 6]} intensity={1.2} color="#fff5e5" />
    <directionalLight position={[4, 1, 3]} intensity={.35} color="#ffffff" />
    <directionalLight position={[0, 4, -2]} intensity={.7} color="#fff1db" />
    <Suspense fallback={null}><Strawberry onReady={onReady} /></Suspense>
  </Canvas>
}
