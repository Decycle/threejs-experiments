import {
  OrbitControls,
  PerspectiveCamera,
  Text,
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
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector3,
} from 'three'
import {
  EffectComposer,
  Bloom,
} from '@react-three/postprocessing'

import mat1 from './ShaderPatterns/1'
import mat2 from './ShaderPatterns/2'
import mat3 from './ShaderPatterns/3'
import mat4 from './ShaderPatterns/4'
import mat5 from './ShaderPatterns/5'
import mat6 from './ShaderPatterns/6'
import mat7 from './ShaderPatterns/7'
import mat8 from './ShaderPatterns/8'
import mat9 from './ShaderPatterns/9'
import mat10 from './ShaderPatterns/10'
import mat11 from './ShaderPatterns/11'
import mat12 from './ShaderPatterns/12'
import mat13 from './ShaderPatterns/13'
import mat14 from './ShaderPatterns/14'
import mat15 from './ShaderPatterns/15'
import mat16 from './ShaderPatterns/16'
import mat17 from './ShaderPatterns/17'
import mat18 from './ShaderPatterns/18'
import mat19 from './ShaderPatterns/19'
import mat20 from './ShaderPatterns/20'
import mat21 from './ShaderPatterns/21'
import mat22 from './ShaderPatterns/22'
import mat23 from './ShaderPatterns/23'
import mat24 from './ShaderPatterns/24'
import mat25 from './ShaderPatterns/25'
import mat26 from './ShaderPatterns/26'
import mat27 from './ShaderPatterns/27'
import mat28 from './ShaderPatterns/28'
import mat29 from './ShaderPatterns/29'
import mat30 from './ShaderPatterns/30'
import mat31 from './ShaderPatterns/31'
import mat32 from './ShaderPatterns/32'
import mat33 from './ShaderPatterns/33'
import mat34 from './ShaderPatterns/34'
import mat35 from './ShaderPatterns/35'
import mat36 from './ShaderPatterns/36'
import mat37 from './ShaderPatterns/37'
import mat38 from './ShaderPatterns/38'
import mat39 from './ShaderPatterns/39'
import mat40 from './ShaderPatterns/40'
import mat41 from './ShaderPatterns/41'
import mat42 from './ShaderPatterns/42'
import mat43 from './ShaderPatterns/43'
import mat44 from './ShaderPatterns/44'
import mat45 from './ShaderPatterns/45'
import mat46 from './ShaderPatterns/46'
import mat47 from './ShaderPatterns/47'
import mat48 from './ShaderPatterns/48'
import mat49 from './ShaderPatterns/49'
import mat50 from './ShaderPatterns/50'
import mat51 from './ShaderPatterns/51'
import mat52 from './ShaderPatterns/52'
import mat53 from './ShaderPatterns/53'

const MandelbrotSet = () => {
  const vertexShader = /*glsl	*/ `


    varying vec3 vPosition;

    void main()
    {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;

      vPosition = modelPosition.xyz;
    }
  `
  const fragmentShader = /*glsl	*/ `

    uniform float uIter;

    varying vec3 vPosition;

    vec2 complexProduct(vec2 a, vec2 b)
    {
      return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    vec2 iter(vec2 z, vec2 c)
    {
      return complexProduct(z, z) + c;
    }

    float mandelbrot(vec2 c, int maxIter)
    {
      vec2 z = vec2(0.0);
      for (int i = 0; i < maxIter; i++)
      {
        z = iter(z, c);
        if (length(z) > 4.0)
        {
          return float(i) / float(maxIter);
        }
      }
      return 0.0;
    }

    void main()
    {
      vec2 p = vPosition.xy;
      float d = mandelbrot(p, int(uIter));

      gl_FragColor = vec4(d, d, d, 1.0);
    }
  `

  const { length, height, iter } = useControls({
    length: {
      min: 0.1,
      max: 10,
      step: 0.1,
      value: 4,
    },
    height: {
      min: 0.1,
      max: 10,
      step: 0.1,
      value: 4,
    },
    iter: {
      min: 2,
      max: 1000,
      step: 1,
      value: 2,
    },
  })

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uIter: { value: iter },
        },
      }),
    [vertexShader, fragmentShader, iter]
  )

  return (
    <mesh material={material}>
      <planeBufferGeometry
        args={[length, height, 100, 100]}
      />
    </mesh>
  )
}

const ShaderPatterns = () => {
  const materials = [
    mat1,
    mat2,
    mat3,
    mat4,
    mat5,
    mat6,
    mat7,
    mat8,
    mat9,
    mat10,
    mat11,
    mat12,
    mat13,
    mat14,
    mat15,
    mat16,
    mat17,
    mat18,
    mat19,
    mat20,
    mat21,
    mat22,
    mat23,
    mat24,
    mat25,
    mat26,
    mat27,
    mat28,
    mat29,
    mat30,
    mat31,
    mat32,
    mat33,
    mat34,
    mat35,
    mat36,
    mat37,
    mat38,
    mat39,
    mat40,
    mat41,
    mat42,
    mat43,
    mat44,
    mat45,
    mat46,
    mat47,
    mat48,
    mat49,
    mat50,
    mat51,
    mat52,
    mat53,
  ]
  const needTime: number[] = [49, 50, 51, 52, 53]
  const useSphere: number[] = []
  const width = 8

  const { w, h, x1, x2, y1, y2 } = {
    w: 1,
    h: 1,
    x1: 1,
    x2: 2,
    y1: 1,
    y2: 2,
  }

  materials[49].uniforms.uWidth.value = w
  materials[49].uniforms.uHeight.value = h
  materials[49].uniforms.uX1.value = x1
  materials[49].uniforms.uX2.value = x2
  materials[49].uniforms.uY1.value = y1
  materials[49].uniforms.uY2.value = y2

  useFrame(({ clock }) => {
    materials.forEach(
      (m, i) =>
        needTime.includes(i + 1) &&
        (m.uniforms.uTime.value = clock.getElapsedTime())
    )
  })

  return (
    <group>
      {materials.map((mat, i) => (
        <group
          position={[
            1.3 * (i % width) - 1.7,
            1.5 - 1.3 * Math.floor(i / width),
            0,
          ]}
          key={i}>
          <Text
            position={[0, 0.6, 0]}
            color='white'
            anchorX='center'
            anchorY='middle'
            fontSize={0.2}>
            {i + 1}
          </Text>
          <mesh material={mat}>
            {useSphere.includes(i + 1) ? (
              <icosahedronBufferGeometry args={[0.5, 10]} />
            ) : (
              <planeBufferGeometry args={[1, 1]} />
            )}
          </mesh>
        </group>
      ))}
    </group>
  )
}

const Hexagon = () => {
  const xCount = 1000
  const yCount = 1000

  const width = 10
  const height = 10

  const geometry = new BufferGeometry()
  const positions = new Float32Array(xCount * yCount * 3)
  const colors = new Float32Array(xCount * yCount * 3)

  // for (let i = 0; i < count; i++) {
  //   positions[i + 0] = Math.random() * 2 - 1
  //   positions[i + 1] = Math.random() * 2 - 1
  //   positions[i + 2] = Math.random() * 2 - 1
  //   colors[i + 0] = Math.random()
  //   colors[i + 1] = Math.random()
  //   colors[i + 2] = Math.random()
  // }

  for (let i = 0; i < xCount; i++) {
    for (let j = 0; j < yCount; j++) {
      const index3 = (i * xCount + j) * 3
      positions[index3 + 0] = ((i / xCount) * 2 - 1) * width
      positions[index3 + 1] =
        ((j / yCount) * 2 - 1) * height
      positions[index3 + 2] = 0

      const hexCenter = (i: number, j: number) => [
        Math.round(i),
        Math.round(j / Math.sqrt(3)),
      ]

      colors[index3 + 0] = hexCenter(i, j)[0] / xCount
      colors[index3 + 1] = hexCenter(i, j)[1] / yCount
      colors[index3 + 2] = 1.0
    }
  }

  geometry.setAttribute(
    'position',
    new BufferAttribute(positions, 3)
  )
  geometry.setAttribute(
    'color',
    new BufferAttribute(colors, 3)
  )

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.01}
        sizeAttenuation
        vertexColors
      />
    </points>
  )
}

const Scene = () => {
  return (
    <>
      {/* <ValueNoise seed='decyc' /> */}
      <ShaderPatterns />
    </>
  )
}

const MainCanvas = () => {
  return (
    <Canvas>
      <PerspectiveCamera
        position={[0, 0, 8]}
        args={[
          75,
          window.innerWidth / window.innerHeight,
          0.0000001,
          1000,
        ]}
        makeDefault
        // rotation-z={-Math.PI / 2}
      />
      <OrbitControls />
      <Scene />
    </Canvas>
  )
}

export default MainCanvas
