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
    float r = length(vUv - 0.5);

    gl_FragColor = vec4(vec3(abs(r - 0.25)), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
