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

  vec2 rotate(vec2 v, float a, vec2 o)
  {
    mat2 rotationMatrix = mat2(cos(a), sin(a), -sin(a), cos(a));
    return rotationMatrix * (v - o) + o;
  }

  void main()
  {
    vec2 uv = vUv - 0.5;
    vec2 p = rotate(uv, PI / 4.0, vec2(0.0));
    float x = p.x;
    float y = p.y;

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
