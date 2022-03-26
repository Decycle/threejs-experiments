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

  varying vec3 vPosition;
  varying vec2 vUv;
  void main()
  {
    float x = vUv.x - 0.5;
    float y = vUv.y - 0.5;

    float r1 = length(vec2(x, y * 5.0));
    float r2 = length(vec2(x * 5.0, y));
    gl_FragColor = vec4(vec3(0.15 / r1 * 0.15 / r2), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
