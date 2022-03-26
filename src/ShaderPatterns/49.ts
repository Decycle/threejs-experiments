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

  const float PI = 3.1415926535897932384626433832795;

  uniform float uTime;
  varying vec3 vPosition;
  varying vec2 vUv;

  float hash11(float p)
  {
    p = p * 100.0;
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float valueNoise(float p)
  {
    float p1 = hash11(floor(p));
    float p2 = hash11(floor(p) + 1.0);

    float x = fract(p);
    float y = 1.0 - x;

    float v1 = p1 * x;
    float v2 = p2 * y;

    float t = x * x * x * (x * (x * 6.0 - 15.0) + 10.0);

    return mix(v1, v2, t);
  }

  float noise(float p)
  {
    return valueNoise(2.0 * p ) / 2.0
                + valueNoise(4.0 * p - 0.5) / 4.0
                + valueNoise(8.0 * p - 1.0) / 8.0
                + valueNoise(16.0 * p + 1.0) / 16.0;
  }

  float movingCircle(vec2 center, float radius, float thickness, float speed, float intensity)
  {
    float r = length(vUv - center);
    float circleNoise = noise(vUv.x * 0.4 + uTime * speed) + noise(vUv.y * 0.4 + uTime * speed);
    float circle = step(thickness / 2.0, abs(r + circleNoise * intensity - radius));

    return 1.0 - circle;
  }

  void main()
  {
    float circle1 = movingCircle(vec2(0.5, 0.5), 0.2, 0.01, 0.05, 0.1);
    float circle2 = movingCircle(vec2(0.5, 0.5), 0.3, 0.01, 0.1, 0.05);
    float circle3 = movingCircle(vec2(0.5, 0.5), 0.45, 0.01, 0.15, 0.10);

    float theta = mod(atan(vUv.y - 0.5, vUv.x - 0.5), PI * 2.0);

    gl_FragColor = vec4(vec3(1.0 - (circle1 + circle2 + circle3)), 1.0);

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
