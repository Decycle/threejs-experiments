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
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    gl_FragColor = vec4(vec3(abs(angle / PI)), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
