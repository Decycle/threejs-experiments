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

    float square1 = max(step(0.25, abs(x - 0.5)), step(0.25, abs(y - 0.5)));
    float square2 = max(step(0.2, abs(x - 0.5)), step(0.2, abs(y - 0.5)));

    gl_FragColor = vec4(vec3((1.0 - square1) * square2), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
