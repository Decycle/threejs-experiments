import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import {
  Canvas,
  useFrame,
  useLoader,
} from '@react-three/fiber'
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  useCubeTexture,
} from '@react-three/drei'
import { useControls } from 'leva'
import {
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Shape,
  ShapeGeometry,
  Texture,
  TorusGeometry,
} from 'three'

import * as NEA from 'fp-ts/NonEmptyArray'
import { pipe } from 'fp-ts/function'

type TextMeshProps = JSX.IntrinsicElements['mesh'] & {
  text: string
}

const TextMesh = ({ text, ...props }: TextMeshProps) => {
  const font = useLoader(
    FontLoader,
    'fonts/helvetiker_regular.typeface.json'
  )

  const geometry = useMemo(
    () =>
      new TextGeometry(text, {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 16,
      }),
    [font, text]
  )

  useLayoutEffect(() => {
    geometry.computeBoundingBox()
    geometry.center()
  }, [geometry])

  return <mesh geometry={geometry} {...props}></mesh>
}

type DonutProps = JSX.IntrinsicElements['mesh'] & {
  speed: [number, number, number]
}
const Donut = ({ speed, ...props }: DonutProps) => {
  const group = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (group.current) {
      group.current.rotateX(speed[0])
      group.current.rotateY(speed[1])
      group.current.rotateZ(speed[2])
    }
  })

  return (
    <group ref={group}>
      <mesh {...props}></mesh>
    </group>
  )
}

const Donuts = (props: JSX.IntrinsicElements['mesh']) => {
  const heartShape = new Shape()
  const x = 0,
    y = 0
  heartShape.moveTo(x + 5, y + 5)
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
  heartShape.bezierCurveTo(
    x - 6,
    y,
    x - 6,
    y + 7,
    x - 6,
    y + 7
  )
  heartShape.bezierCurveTo(
    x - 6,
    y + 11,
    x - 3,
    y + 15.4,
    x + 5,
    y + 19
  )
  heartShape.bezierCurveTo(
    x + 12,
    y + 15.4,
    x + 16,
    y + 11,
    x + 16,
    y + 7
  )
  heartShape.bezierCurveTo(
    x + 16,
    y + 7,
    x + 16,
    y,
    x + 10,
    y
  )
  heartShape.bezierCurveTo(
    x + 7,
    y,
    x + 5,
    y + 5,
    x + 5,
    y + 5
  )

  const donutGeometry = useMemo(
    () => new ShapeGeometry(heartShape),
    []
  )

  return (
    <group>
      {pipe(
        NEA.range(0, 1000),
        NEA.map(() => (
          <Donut
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
            ]}
            rotation-x={Math.random() * Math.PI}
            rotation-y={Math.random() * Math.PI}
            scale={Math.max(Math.random() * 0.05, 0.03)}
            geometry={donutGeometry}
            speed={[
              Math.random() * 0.001,
              Math.random() * 0.001,
              Math.random() * 0.001,
            ]}
            {...props}></Donut>
        ))
      )}
    </group>
  )
}

const Shapes = () => {
  const matcaps: { [key: number]: Texture } = useTexture({
    0: '/textures/matcaps/1.png',
    1: '/textures/matcaps/2.png',
    2: '/textures/matcaps/3.png',
    3: '/textures/matcaps/4.png',
    4: '/textures/matcaps/5.png',
    5: '/textures/matcaps/6.png',
    6: '/textures/matcaps/7.png',
    7: '/textures/matcaps/8.png',
  })

  const {
    useMatcap,
    text,
    matcapIndex,
    envMapIndex,
    metalness,
    roughness,
    tint,
  } = useControls({
    text: 'Love SalTT!!!!',
    useMatcap: true,
    matcapIndex: {
      value: 0,
      options: [0, 1, 2, 3, 4, 5, 6, 7],
      render: (get) => get('useMatcap'),
    },
    envMapIndex: {
      value: 0,
      options: [0, 1, 2, 3],
      render: (get) => !get('useMatcap'),
    },
    metalness: {
      value: 0.5,
      min: 0,
      max: 1,
      render: (get) => !get('useMatcap'),
    },
    roughness: {
      value: 0.5,
      min: 0,
      max: 1,
      render: (get) => !get('useMatcap'),
    },
    tint: '#ffffff',
  })

  const envMaps = useCubeTexture(
    [
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg',
    ],
    {
      path: `/textures/environmentMaps/${envMapIndex}/`,
    }
  )

  const material = useMemo(
    () =>
      useMatcap
        ? new MeshMatcapMaterial({
            matcap: matcaps[matcapIndex],
            color: tint,
          })
        : new MeshStandardMaterial({
            metalness,
            roughness,
            color: tint,
            envMap: envMaps,
          }),
    [
      envMaps,
      matcapIndex,
      matcaps,
      metalness,
      roughness,
      tint,
      useMatcap,
    ]
  )

  const heartMaterial = new MeshStandardMaterial({
    color: '#f55858',
    metalness: 1.0,
    roughness: 0.2,
    envMap: envMaps,
  })

  return (
    <>
      <TextMesh material={material} text={text} />
      <Donuts material={heartMaterial} />
    </>
  )
}

const ThreeCanvas = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 5]}
        near={0.01}
        far={1000}
        fov={75}
      />
      <OrbitControls />
      <Shapes />
    </Canvas>
  )
}

export default ThreeCanvas
