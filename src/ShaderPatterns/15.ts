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

  vec3 barX(float x, float y)
  {
    return vec3(step(0.8, fract(x * 10.0))) * vec3(step(0.4, fract(y * 10.0)));
  }

  vec3 barY(float x, float y)
  {
    return vec3(step(0.8, fract(y * 10.0))) * vec3
    (step(0.4, fract(x * 10.0)));
  }

  void main()
  {
    float x = vUv.x;
    float y = vUv.y;

    gl_FragColor = vec4(barX(x + 0.02, y) + barY(x, y + 0.02), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
