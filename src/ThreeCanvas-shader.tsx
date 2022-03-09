import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from '@react-three/drei'
import {
  Canvas,
  useFrame,
  useThree,
} from '@react-three/fiber'
import { button, useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  ArrowHelper,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Euler,
  PointsMaterial,
  Quaternion,
  Raycaster,
  Vector3,
} from 'three'
import { pipe } from 'fp-ts/lib/function'

const ShaderExample = () => {
  const vertexShader = /*glsl	*/ `
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;

    attribute vec3 position;

    void main()
    {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `
  const fragmentShader = /*glsl	*/ `
  precision mediump float;
  void main()
  {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `

  return (
    <mesh>
      <planeBufferGeometry args={[1, 1, 30, 30]} />
      <rawShaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}></rawShaderMaterial>
    </mesh>
  )
}

const Scene = () => {
  return (
    <>
      {/* <ValueNoise seed='decyc' /> */}
      <ShaderExample />
    </>
  )
}

const MainCanvas = () => {
  return (
    <Canvas>
      <PerspectiveCamera
        position={[0, 0, 2]}
        makeDefault
        // rotation-z={-Math.PI / 2}
      />
      <OrbitControls />
      <Scene />
    </Canvas>
  )
}

export default MainCanvas
