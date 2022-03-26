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
  uniform float uTime;
  varying vec3 vPosition;
  varying vec2 vUv;

  const float PI = 3.14159265358979323846264;

  float cubic_bezier(float t, float p0, float p1, float p2, float p3)
  {
    float t2 = t * t;
    float t3 = t2 * t;
    float a = 1. - t;
    float a2 = a * a;
    float a3 = a2 * a;

    return a3 * p0 + 3. * a2 * t * p1 + 3. * a * t2 * p2 + t3 * p3;
  }

  float arc(vec2 p, vec2 o, float r, float thickness, float arcLength, float offset)
  {
    float theta = mod(atan(p.y - o.y, p.x - o.x) + offset, 2. * PI);
    float d = abs(length(p - o) - r);
    float dt = thickness / 2.;

    return (1. - step(dt, d)) * (1. - step(arcLength, theta));
  }

  void main()
  {
    vec2 p = vUv - 0.5;

    float r = length(p);
    // float theta = atan(p.y, p.x);

    // float i = abs(r - 0.4) < 0.01 ? 1. : 0.;
    // i *= mod(theta + uTime * cubic_bezier(), PI * 2.) < 2. ? 1. : 0.;

    float t = mod(uTime * 5., PI * 2.);
    t = cubic_bezier(t / PI / 2., 0., -0.2, 1.2, 1.);

    float i = arc(p, vec2(0.0), 0.4, 0.02, 1., t * PI * 2.);

    gl_FragColor = vec4(vec3(i), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
  },
})

export default material
