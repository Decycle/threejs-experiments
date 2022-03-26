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

  float random(vec2 co)
  {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  float smoothMix(float a, float b, float t)
  {
    return mix(a, b, t * t * t * (t * (t * 6.0 - 15.0) + 10.0));
  }

  float valueNoise(vec2 p)
  {
    vec2 a = floor(p);
    vec2 b = a + vec2(1.0, 0.0);
    vec2 c = a + vec2(0.0, 1.0);
    vec2 d = a + vec2(1.0, 1.0);

    vec2 u = fract(p);

    float va = random(a);
    float vb = random(b);
    float vc = random(c);
    float vd = random(d);

    float vab = smoothMix(va, vb, u.x);
    float vcd = smoothMix(vc, vd, u.x);

    return smoothMix(vab, vcd, u.y);
  }

  void main()
  {
    float x = vUv.x * 10.0;
    float y = vUv.y * 10.0;

    gl_FragColor = vec4(vec3(valueNoise(vec2(x, y))), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
