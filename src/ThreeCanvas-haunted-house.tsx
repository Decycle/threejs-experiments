import { Canvas, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import {
  OrbitControls,
  PerspectiveCamera,
  useHelper,
  useTexture,
} from '@react-three/drei'
import { useControls } from 'leva'
import {
  CameraHelper,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from 'three'

const Ground = (props: JSX.IntrinsicElements['mesh']) => {
  return (
    <mesh>
      <planeBufferGeometry
        attach='geometry'
        args={[100, 100]}
      />
      <meshStandardMaterial
        attach='material'
        color='#ccc'
      />
    </mesh>
  )
}

const HauntedHouse = () => {
  return (
    <group>
      <Ground position={[0, 0, 0]} />
    </group>
  )
}

const ThreeCanvas = () => {
  return (
    <Canvas>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 5]}
        near={0.01}
        far={1000}
        fov={75}
      />
      <HauntedHouse />
      <OrbitControls makeDefault />
    </Canvas>
  )
}

export default ThreeCanvas
