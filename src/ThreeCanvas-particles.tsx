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
import { useMemo } from 'react'
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
  Vector3,
} from 'three'

type fibonacciSphereProps =
  JSX.IntrinsicElements['points'] & {
    spread: number
  }

const FibonacciSphere = ({
  spread,
  ...props
}: fibonacciSphereProps) => {
  const ParticleGeometry = new BufferGeometry()
  const count = spread

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const phi = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < spread; i++) {
    const y = 1 - (i / (spread - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i

    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    colors[i * 3 + 0] = (x + 1) / 2
    colors[i * 3 + 1] = (y + 1) / 2
    colors[i * 3 + 2] = (z + 1) / 2
  }

  ParticleGeometry.setAttribute(
    'position',
    new BufferAttribute(positions, 3)
  )
  ParticleGeometry.setAttribute(
    'color',
    new BufferAttribute(colors, 3)
  )
  return (
    <points geometry={ParticleGeometry} {...props}>
      <pointsMaterial
        size={0.005}
        vertexColors
        sizeAttenuation
      />
    </points>
  )
}

type fibonacciSphereWithDepthProps =
  fibonacciSphereProps & {
    depth: number
  }

const FibonacciSphereWithDepth = ({
  spread,
  depth,
  ...props
}: fibonacciSphereWithDepthProps) => {
  const ParticleGeometry = new BufferGeometry()
  const count = spread * depth

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const phi = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < spread; i++) {
    for (let j = 0; j < depth; j++) {
      const y = 1 - (i / (spread - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = phi * i

      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r

      const index = i * depth + j

      positions[index * 3] = (x * j) / depth
      positions[index * 3 + 1] = (y * j) / depth
      positions[index * 3 + 2] = (z * j) / depth

      colors[index * 3 + 0] = (((x + 1) / 2) * j) / depth
      colors[index * 3 + 1] = (((y + 1) / 2) * j) / depth
      colors[index * 3 + 2] = (((z + 1) / 2) * j) / depth
    }
  }
  ParticleGeometry.setAttribute(
    'position',
    new BufferAttribute(positions, 3)
  )
  ParticleGeometry.setAttribute(
    'color',
    new BufferAttribute(colors, 3)
  )
  return (
    <points geometry={ParticleGeometry} {...props}>
      <pointsMaterial
        size={0.005}
        vertexColors
        sizeAttenuation
      />
    </points>
  )
}

const SphereHollowDesign = () => {
  const count = 10000
  const positions: Vector3[] = []
  const colors: string[] = []

  const phi = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i

    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r

    positions.push(new Vector3(x, y, z))

    const red = Math.floor(((x + 1) * 255) / 2)
    const green = Math.floor(((y + 1) * 255) / 2)
    const blue = Math.floor(((z + 1) * 255) / 2)

    colors.push(`rgb(${red}, ${green}, ${blue})`)
  }

  return (
    <>
      {positions.map((_, index) => {
        const position = positions[index]
        const [x, y, z] = position.toArray()

        return (
          <mesh
            position={positions[index]}
            quaternion={new Quaternion().setFromAxisAngle(
              position,
              Math.PI
            )}
            key={x * 100 + y * 10 + z}>
            <planeBufferGeometry args={[0.02, 0.02]} />
            <meshBasicMaterial
              color={colors[index]}
              side={DoubleSide}
            />
          </mesh>
        )
      })}
    </>
  )
}

const SpherePlanes = () => {
  const count = 1000
  const positions: Vector3[] = []
  const colors: string[] = []

  const phi = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i

    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r

    positions.push(new Vector3(x, y, z))

    const red = Math.floor(((x + 1) * 255) / 2)
    const green = Math.floor(((y + 1) * 255) / 2)
    const blue = Math.floor(((z + 1) * 255) / 2)

    colors.push(`rgb(${red}, ${green}, ${blue})`)
  }

  return (
    <>
      {positions.map((_, index) => {
        const position = positions[index]
        const [x, y, z] = position.toArray()

        const axis = new Vector3(0, 0, 1)
          .add(position)
          .normalize()

        const quaternion =
          new Quaternion().multiplyQuaternions(
            new Quaternion().setFromAxisAngle(
              axis,
              Math.PI
            ),
            new Quaternion().setFromAxisAngle(
              new Vector3(0, 0, 1),
              0
            )
          )

        return (
          <mesh
            position={positions[index]}
            quaternion={quaternion}
            key={x * 100 + y * 10 + z}>
            <planeBufferGeometry args={[0.04, 0.04]} />
            <meshBasicMaterial
              color={colors[index]}
              side={DoubleSide}
            />
          </mesh>
        )
      })}
    </>
  )
}

const ArrowHelperMesh = ({ dir }: { dir: Vector3 }) => {
  const arrow = new ArrowHelper(
    dir,
    new Vector3(0, 0, 0),
    2
  )
  return <primitive object={arrow} />
}

const SphereArrowDemo = () => {
  const planeOldDir = new Vector3(0, 0, 1)

  const { planeInputDir, rotation } = useControls({
    planeInputDir: {
      x: 0,
      y: 1,
      z: 0,
    },
    rotation: {
      min: 0,
      max: 180,
      step: 1,
      value: 0,
    },
  })

  const { x, y, z } = planeInputDir
  const planeInputDirNormalized = new Vector3(
    x,
    y,
    z
  ).normalize()

  let planeNewDir = planeOldDir.add(planeInputDirNormalized)

  if (planeNewDir.length() < 0.01) {
    planeNewDir = new Vector3(0, 1, 0)
  }

  planeNewDir.normalize()

  const quaternion = new Quaternion()
    .setFromAxisAngle(planeNewDir, Math.PI)
    .multiply(
      new Quaternion().setFromAxisAngle(
        new Vector3(0, 0, 1),
        (rotation / 180) * Math.PI
      )
    )

  return (
    <>
      <mesh>
        <icosahedronBufferGeometry
          attach='geometry'
          args={[1, 4]}
        />
        <meshBasicMaterial wireframe />
      </mesh>

      <mesh>
        <planeBufferGeometry args={[2, 2]} />
        <meshBasicMaterial wireframe />
      </mesh>

      <mesh quaternion={quaternion}>
        <planeBufferGeometry args={[2, 2]} />
        <meshBasicMaterial wireframe />
      </mesh>

      <ArrowHelperMesh dir={new Vector3(0, 0, 1)} />
      <ArrowHelperMesh dir={planeInputDirNormalized} />
      <ArrowHelperMesh dir={planeNewDir} />
    </>
  )
}

const Particles = () => {
  const count = 100000
  const particleGeometry = new BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const x = Math.random() * 2 - 1
    const y = Math.random() * 2 - 1
    const z = Math.random() * 2 - 1

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    colors[i * 3] = (x + 1) / 10
    colors[i * 3 + 1] = (y + 1) / 10
    colors[i * 3 + 2] = (z + 1) / 10
  }

  particleGeometry.setAttribute(
    'position',
    new BufferAttribute(positions, 3)
  )

  particleGeometry.setAttribute(
    'color',
    new BufferAttribute(colors, 3)
  )

  // const next = (x: number) => Math.cos(x) * 10

  const updateParticles = () => {
    const oldPosition =
      particleGeometry.getAttribute('position').array
    const newPosition = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const x = oldPosition[i * 3]
      const y = oldPosition[i * 3 + 1]
      const z = oldPosition[i * 3 + 2]

      newPosition[i * 3] = x
      newPosition[i * 3 + 1] = Math.tan(y)
      newPosition[i * 3 + 2] = z * 1.001
    }

    particleGeometry.setAttribute(
      'position',
      new BufferAttribute(newPosition, 3)
    )
  }

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    // if (elapsedTime < 0.5) {
    updateParticles()
    // }
  })

  const particleTextures = useTexture({
    alphaMap: '/textures/particles/1.png',
  })

  const particleMaterial = useMemo(
    () =>
      new PointsMaterial({
        size: 0.02,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true,
        ...particleTextures,
      }),
    [particleTextures]
  )

  return (
    <points
      geometry={particleGeometry}
      material={particleMaterial}></points>
  )
}

const FunctionSeries = ({
  func,
  startValue,
}: {
  func: (x: number) => number
  startValue: number
}) => {
  const count = 1000
  const particleGeometry = new BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const x = func(startValue)
    startValue = x
    const y = i + 1
    const z = 0

    positions[3 * i + 1] = x * 100
    positions[3 * i + 2] = y
    positions[3 * i + 3] = z
  }

  particleGeometry.setAttribute(
    'position',
    new BufferAttribute(positions, 3)
  )

  return (
    <>
      <points geometry={particleGeometry}>
        <pointsMaterial size={1} />
      </points>
      <primitive
        object={
          new ArrowHelper(
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 0),
            100
          )
        }
      />
      <primitive
        object={
          new ArrowHelper(
            new Vector3(0, 1, 0),
            new Vector3(0, 0, 0),
            100
          )
        }
      />
      <mesh position={[0, 100, 0]}>
        <boxBufferGeometry args={[10, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
      <mesh position={[0, -100, 0]}>
        <boxBufferGeometry args={[10, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
    </>
  )
}

const Galaxy = () => {
  const { camera } = useThree()

  const {
    count,
    size,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
  } = useControls({
    count: {
      min: 100,
      max: 1000000,
      value: 370000,
      step: 100,
    },
    size: {
      min: 0.001,
      max: 0.1,
      value: 0.01,
      step: 0.001,
    },
    radius: {
      min: 0.01,
      max: 20,
      value: 5,
      step: 0.01,
    },
    branches: {
      min: 2,
      max: 20,
      value: 3,
      step: 1,
    },
    spin: {
      min: -5,
      max: 5,
      value: 0.7,
      step: 0.001,
    },
    randomness: {
      min: 0,
      max: 2,
      value: 0.57,
      step: 0.001,
    },
    randomnessPower: {
      min: 1,
      max: 10,
      value: 2.7,
      step: 0.001,
    },
    insideColor: '#2e0d03',
    outsideColor: '#090310',
    cameraPosition: button(() => {
      console.log(camera.position)
      console.log(camera.quaternion)
    }),
  })

  const geometry = new BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const r = Math.random() * radius
    const spinAngle = r * spin
    const branchAngle =
      ((i % branches) / branches) * Math.PI * 2

    const randomX =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      r
    const randomY =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      r
    const randomZ =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      r

    positions[i3 + 0] =
      Math.cos(branchAngle + spinAngle) * r + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * r + randomZ

    const color = new Color(insideColor)
    color.lerp(new Color(outsideColor), r / radius)

    colors[i3 + 0] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }

  geometry.setAttribute(
    'position',
    new BufferAttribute(positions, 3)
  )

  geometry.setAttribute(
    'color',
    new BufferAttribute(colors, 3)
  )

  const material = useMemo(
    () =>
      new PointsMaterial({
        size: size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true,
      }),
    [size]
  )

  return (
    <points
      geometry={geometry}
      material={material}></points>
  )
}

const Scene = () => {
  return (
    <>
      {/* <FunctionSeries
        func={(x) => Math.cos(x) * 6}
        startValue={0.9}
      /> */}
      <Galaxy />
    </>
  )
}

const MainCanvas = () => {
  return (
    <Canvas>
      <PerspectiveCamera
        position={[0, 3, 5]}
        makeDefault
        // rotation-z={-Math.PI / 2}
      />
      <OrbitControls />
      <Scene />
    </Canvas>
  )
}

export default MainCanvas
