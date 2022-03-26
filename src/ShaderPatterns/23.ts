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

  float random(vec2 st)
  {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main()
  {

    gl_FragColor = vec4(vec3(random(vUv)), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
