import {
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import {
  ArrowHelper,
  BufferAttribute,
  BufferGeometry,
  Raycaster,
  Vector3,
} from 'three'

import seedrandom from 'seedrandom'
import { shuffle } from './Algorithm'
import { pipe } from 'fp-ts/lib/function'

const ValueNoise = ({ seed }: { seed: string }) => {
  const { len, size, depth, smooth } = useControls({
    len: {
      min: 5,
      max: 1000,
      step: 1,
      value: 100,
    },
    size: {
      min: 5,
      max: 100,
      step: 1,
      value: 3,
    },
    depth: {
      min: 0,
      max: 3,
      value: 1,
      dpeth: 0.1,
    },
    smooth: false,
  })

  const gemoetry = new BufferGeometry()
  const positions = new Float32Array(len * len * 3)

  const random = seedrandom(seed)

  const lattices = new Float32Array((size + 1) * (size + 1))
  for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
      lattices[i * size + j] = random() * depth
    }
  }

  const lerp = (a: number, b: number, t: number) =>
    (1 - t) * a + t * b

  const smoothLerp = (a: number, b: number, t: number) =>
    lerp(a, b, t * t * t * (6 * t * t - 15 * t + 10))

  const valueNoise = (
    x: number,
    y: number,
    smooth: boolean
  ) => {
    const i = x - Math.floor(x)
    const j = y - Math.floor(y)

    const a = lattices[Math.floor(x) * size + Math.floor(y)]
    const b = lattices[Math.floor(x) * size + Math.ceil(y)]
    const c = lattices[Math.ceil(x) * size + Math.floor(y)]
    const d = lattices[Math.ceil(x) * size + Math.ceil(y)]

    if (smooth) {
      return smoothLerp(
        smoothLerp(a, c, i),
        smoothLerp(b, d, i),
        j
      )
    }

    const ac = lerp(a, c, i)
    const bd = lerp(b, d, i)

    const abcd = lerp(ac, bd, j)

    return abcd
  }

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      const x = (i / len) * size
      const y = (j / len) * size
      const z = valueNoise(x, y, smooth)

      const index = (i * len + j) * 3

      positions[index + 0] = x
      positions[index + 1] = y
      positions[index + 2] = z
    }
  }

  gemoetry.setAttribute(
    'position',
    new BufferAttribute(positions, 3)
  )

  return (
    <points geometry={gemoetry}>
      <pointsMaterial size={0.01} />
    </points>
  )
}

const PerlinNoise = ({ seed }: { seed: string }) => {
  const { len, size, depth, smooth } = useControls({
    len: {
      min: 5,
      max: 1000,
      step: 1,
      value: 100,
    },
    size: {
      min: 5,
      max: 100,
      step: 1,
      value: 3,
    },
    depth: {
      min: 0,
      max: 3,
      value: 1,
      dpeth: 0.1,
    },
    smooth: false,
  })

  const gemoetry = new BufferGeometry()
  const positions = new Float32Array(len * len * 3)

  const random = seedrandom(seed)

  const unitVectors: Vector3[] = [
    new Vector3(-1, 1, 0),
    new Vector3(1, -1, 0),
    new Vector3(-1, -1, 0),
    new Vector3(1, 0, 1),
    new Vector3(-1, 0, 1),
    new Vector3(1, 0, -1),
    new Vector3(-1, 0, -1),
    new Vector3(0, 1, 1),
    new Vector3(0, -1, 1),
    new Vector3(0, 1, -1),
    new Vector3(0, -1, -1),
  ]

  const permutations = pipe(
    new Uint8Array(256).map((_, i) => i),
    shuffle(seed)
  )

  //   const hash = (x: number, y: number, z: number) => {

  console.log(permutations)

  const lattices: Vector3[] = []

  for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
      const vector =
        unitVectors[
          Math.floor(random() * unitVectors.length)
        ]
      lattices.push(vector)
    }
  }

  const lerp = (a: number, b: number, t: number) =>
    (1 - t) * a + t * b

  const smoothLerp = (a: number, b: number, t: number) =>
    lerp(a, b, t * t * t * (6 * t * t - 15 * t + 10))

  return (
    <>
      {lattices.map((v, i) => {
        const xi = i % (size + 1)
        const yi = Math.floor(i / (size + 1))
        const arrow = new ArrowHelper(
          v,
          new Vector3(xi, yi, 0)
        )
        return <primitive object={arrow} />
      })}
    </>
  )
}

const RayTest = () => {
  const rayOrigin = new Vector3(-6, 0, 0)
  const rayDirection = new Vector3(1, 0, 0)
  const raycaster = new Raycaster(rayOrigin, rayDirection)

  const meshes = useRef<THREE.Mesh[]>([])
  const positions = [
    [-3, 0, 0],
    [0, 0, 0],
    [3, 0, 0],
  ]

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()

    meshes.current[0].position.y =
      Math.sin(elapsed * 0.3) * 1.5
    meshes.current[1].position.y =
      Math.sin(elapsed * 0.8) * 1.5
    meshes.current[2].position.y =
      Math.sin(elapsed * 1.4) * 1.5

    meshes.current.forEach((mesh) => (mesh.visible = false))

    raycaster
      .intersectObjects(meshes.current)
      .forEach((intersect) => {
        intersect.object.visible = true
      })
  })

  return (
    <group>
      <primitive
        object={
          new ArrowHelper(rayDirection, rayOrigin, 14)
        }
      />
      {positions.map(([x, y, z], i) => (
        <mesh
          position={[x, y, z]}
          key={i}
          ref={(el) => (meshes.current[i] = el!)}
          name={`[${x}, ${y}, ${z}]`}>
          <sphereBufferGeometry
            attach='geometry'
            args={[1, 32, 32]}
          />
          <meshBasicMaterial
            attach='material'
            color='red'
          />
        </mesh>
      ))}
    </group>
  )
}

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
