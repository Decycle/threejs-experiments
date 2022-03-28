import {
  OrbitControls,
  PerspectiveCamera,
  useFBO,
} from '@react-three/drei'
import {
  Canvas,
  createPortal,
  useFrame,
} from '@react-three/fiber'
import { useState } from 'react'
import * as THREE from 'three'

const GameOfLife = () => {
  const height = 512
  const width = 512

  const [mainScene] = useState(() => new THREE.Scene())
  const [bufferScene] = useState(() => new THREE.Scene())
  const [camera] = useState(
    () =>
      new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        1 / Math.pow(2, 53),
        1
      )
  )
  const mainTarget = useFBO(512, 512, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  })

  const bufferTarget = useFBO(512, 512, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  })

  const randomColors = new Float32Array(512 * 512 * 4)
  for (let i = 0; i < randomColors.length; i += 4) {
    const intensity = Math.random() > 0.2 ? 1 : 0

    randomColors[i] = intensity
    randomColors[i + 1] = intensity
    randomColors[i + 2] = intensity
    randomColors[i + 3] = 1.0
  }

  const startTexture = new THREE.DataTexture(
    randomColors,
    512,
    512,
    THREE.RGBAFormat,
    THREE.FloatType
  )
  startTexture.needsUpdate = true

  const simulationMaterial = new THREE.ShaderMaterial({
    uniforms: {
      previous_tex: { value: startTexture },
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
    fragmentShader: /* glsl */ `
        uniform sampler2D previous_tex;
        varying vec2 vUv;
        void main() {

            // calculate neighbors
            int n = 0;

            for(int i = -1; i <= 1; i++) {
                for(int j = -1; j <= 1; j++) {
                    if(i == 0 && j == 0) continue;
                    vec4 neighbor = texelFetch(previous_tex,
                        ivec2(int(gl_FragCoord.x) + i, int(gl_FragCoord.y) + j), 0);
                    if(neighbor.r > 0.5) n++;
                }
            }

            // calculate new value
            vec4 current = texelFetch(previous_tex, ivec2(gl_FragCoord.xy), 0);
            float new_value = 0.0;
            if(current.r > 0.5) {
                if(n < 2 || n > 3) new_value = 0.0;
                else new_value = 1.0;
            }
            else {
                if(n == 3) new_value = 1.0;
                else new_value = 0.0;
            }

            gl_FragColor = vec4(vec3(new_value), 1.0);
        }
        `,
  })

  const displayMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tex: { value: bufferTarget.texture },
    },
    vertexShader: /*glsl*/ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /*glsl*/ `
        uniform sampler2D tex;
        varying vec2 vUv;
        void main() {
            gl_FragColor = texture2D(tex, vUv);
        }
    `,
  })

  const render = (gl: THREE.WebGLRenderer) => {
    gl.setRenderTarget(bufferTarget)
    gl.clear()
    gl.render(bufferScene, camera)
    displayMaterial.uniforms.tex.value =
      bufferTarget.texture
    gl.setRenderTarget(mainTarget)
    gl.clear()
    gl.render(mainScene, camera)
    simulationMaterial.uniforms.previous_tex.value =
      mainTarget.texture
  }

  let frame = 0

  useFrame(({ gl, clock }) => {
    if (frame % 50 === 0) {
      render(gl)
    }
    gl.setRenderTarget(null)
    frame++
  })

  return (
    <>
      {createPortal(
        <mesh material={simulationMaterial}>
          <planeBufferGeometry
            attach='geometry'
            args={[2, 2]}
          />
        </mesh>,
        bufferScene
      )}
      {createPortal(
        <mesh material={displayMaterial}>
          <planeBufferGeometry
            attach='geometry'
            args={[2, 2]}
          />
        </mesh>,
        mainScene
      )}
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => {
          if (!e.uv) return
          const x = Math.floor(e.uv.x * width)
          const y = Math.floor(e.uv.y * height)

          console.log(x, y)
        }}>
        <meshBasicMaterial map={mainTarget.texture} />
        <planeBufferGeometry
          attach='geometry'
          args={[2, 2]}
        />
      </mesh>
    </>
  )
}

const Scene = () => {
  return (
    <>
      <GameOfLife />
    </>
  )
}

const MainCanvas = () => {
  return (
    <Canvas>
      <PerspectiveCamera position={[0, 0, 5]} makeDefault />
      <OrbitControls />
      <Scene />
    </Canvas>
  )
}

export default MainCanvas
