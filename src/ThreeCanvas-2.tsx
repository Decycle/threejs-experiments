import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import { useControls } from 'leva'
import { CameraHelper, MeshStandardMaterial } from 'three'

const Objects = () => {
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
      }),
    []
  )

  return (
    <group>
      <mesh
        material={material}
        rotation={[1, 1, 1]}
        castShadow>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh
        position={[-2, 0, 0]}
        material={material}
        castShadow>
        <sphereGeometry args={[0.7, 32, 16]} />
      </mesh>
      <mesh
        position={[2, 0, 0]}
        material={material}
        rotation={[0, 1, 0]}
        castShadow>
        <torusGeometry args={[0.8, 0.2, 16, 32]} />
      </mesh>
      <mesh
        position={[0, -1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={material}
        receiveShadow>
        <planeGeometry args={[100, 100]} />
      </mesh>
    </group>
  )
}

const Lights = () => {
  const { lightIntensity } = useControls({
    lightIntensity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.001,
    },
  })

  const { scene } = useThree()
  const pointLight = useRef<THREE.PointLight>(null)
  useEffect(() => {
    if (!pointLight.current) return
    pointLight.current.shadow.mapSize.width = 1024
    pointLight.current.shadow.mapSize.height = 1024
    pointLight.current.shadow.camera.near = 0.5
    pointLight.current.shadow.camera.far = 10
    const pointLightCameraHelper = new CameraHelper(
      pointLight.current.shadow.camera
    )
    pointLight.current.shadow.radius = 5
    scene.add(pointLightCameraHelper)
    pointLightCameraHelper.visible = false
  }, [scene])

  return (
    <>
      <ambientLight intensity={lightIntensity} />
      <hemisphereLight
        color='#ff0000'
        groundColor='#0000ff'
        intensity={0.3}
      />
      <directionalLight
        color='#00fffc'
        intensity={0.3}
        position={[1, 0.25, 0]}
      />
      <pointLight
        color='#ff9000'
        intensity={0.5}
        position={[0, 3, 0]}
        distance={10}
        decay={2}
        ref={pointLight}
        castShadow
      />
    </>
  )
}

const ThreeCanvas = () => {
  return (
    <Canvas shadows>
      <Lights />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 5]}
        near={0.01}
        far={1000}
        fov={75}
      />
      <OrbitControls makeDefault />
      <Objects />
    </Canvas>
  )
}

export default ThreeCanvas
