import { ShaderMaterial } from 'three'

const vertexShader = /*glsl	*/ `


  varying vec2 vUv;

  void main()
  {
    gl_Position = projectionMatrix *viewMatrix * modelMatrix * vec4(position, 1.0);

    vUv = uv;
  }
`
const fragmentShader = /*glsl	*/ `
  #define PI 3.1415926535897932384626433832795

  varying vec3 vPosition;
  varying vec2 vUv;
  void main()
  {
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);

    float thickness = 0.02;
    float radius = 0.25 + sin(angle * 20.0) * 0.01;
    gl_FragColor = vec4(vec3(1.0 - step(thickness / 2.0, abs(length(vUv - 0.5) - radius))), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
