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

  float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }

  float arc(float lineWidth, float radius, float startingDegree, float degree, vec2 uv)
  {
    float r = length(uv - 0.5);
    float theta = mod(atan(uv.y - 0.5, uv.x - 0.5) + PI + startingDegree, PI * 2.0);
    float circle = step(abs(r - radius), lineWidth / 2.0);
    float arc = circle * step(0.0, (degree - theta));
    return arc;
  }

  float fade(float t)
  {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  void main()
  {
    const float loop = 30.0;
    const float lineWidth = 0.003;

    float arcs = 0.0;

    for(float i = 1.0; i < loop; i++)
    {
      float radius = (i + rand(i)) / loop / 2.0;
      float degree = PI * 2.0 * fade(mod(uTime, 3.0) / 3.0);
      float startingDegree = rand(i) * PI * 2.0;
      float arc = arc(lineWidth, radius, startingDegree, degree, vUv);
      arcs += arc;
    }

    gl_FragColor = vec4(vec3(arcs) * vec3(0.5, 0.7, 1.0), 1.0);
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
