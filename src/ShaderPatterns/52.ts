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

  const vec2 S = vec2(1, 1.7320508075688772);
  const float PI = 3.14159265358979323846264;

  float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 circle(vec2 p, vec2 c, float r, vec3 color)
  {
    return (1. - step(r, length(p - c))) * color;
  }

  vec4 hexInfo(vec2 p)
  {
    vec2 hexCenter1 = round(p / S);
    vec2 hexCenter2 = round(p / S + .5);

    vec2 hexOffset1 = p - hexCenter1 * S;
    vec2 hexOffset2 = p - (hexCenter2 - .5) * S;

    return dot(hexOffset1, hexOffset1) < dot(hexOffset2, hexOffset2)
      ? vec4(hexCenter1, hexOffset1) : vec4(hexCenter2, hexOffset2);
  }

  float calcHexDistance(vec2 uv)
  {
    vec2 p = abs(uv);
    return max(dot(p, S / 2.0), p.x) * 2.0;
  }

  float hexagonHollow(float hd, float r, float thickness)
  {
    return 1.0 - step(thickness / 2.0, abs(hd - r));
  }

  float hexagonFill(float hd, float r)
  {
    return 1.0 - step(r, hd);
  }

  vec3 grid(vec2 uv, vec2 s)
  {
    vec2 p = (uv - .5) * s;

    vec4 info = hexInfo(p);
    vec2 hp = info.xy;
    float hd = calcHexDistance(info.zw);
    float theta = mod(atan(info.z, info.w) + uTime, PI * 2.0);

    vec3 cyan = vec3(26., 151., 162.) / 255.;
    vec3 lightCyan = vec3(0.8, 1.0, 1.0);

    vec3 c = vec3(0.);

    c += hexagonHollow(hd, .99, .02) * .5 * cyan;
    c += hexagonFill(hd, 0.98) * cyan * 0.8;

    c += hexagonHollow(hd, .88, .02) * step(5., theta) * .5  * lightCyan;
    c += hexagonHollow(hd, .77, .02) * step(4., theta) * .5  * lightCyan;

    c += hexagonFill(hd, sin(uTime * 2.0 + rand(hp * 10.0) * 10.) / 2.0 + 1.) * lightCyan * 0.3;


    // c.b += (1.0 - step(0.1, abs(hd - 0.80))) * 0.1;
    // c.b += (1.0 - step(0.35, abs(hd - 0.35))) * 0.6;
    return c;
  }

  void main()
  {
    gl_FragColor = vec4(grid(vUv, vec2(10.0, 10.0)), 1.0);
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
