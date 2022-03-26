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
    vec3 barX = vec3(step(0.8, fract(vUv.x * 10.0))) * vec3(step(0.4, fract(vUv.y * 10.0)));
    vec3 barY = vec3(step(0.8, fract(vUv.y * 10.0))) * vec3(step(0.4, fract(vUv.x * 10.0)));

    gl_FragColor = vec4(barX + barY, 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
