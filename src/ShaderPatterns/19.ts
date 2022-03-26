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
    float x = vUv.x;
    float y = vUv.y;
    gl_FragColor = vec4(vec3(step(0.2, abs(x - 0.5)) + step(0.2, abs(y - 0.5))), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
