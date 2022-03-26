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

  varying vec2 vUv;

  vec2 complexProduct(vec2 a, vec2 b)
  {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }

  vec2 iter(vec2 z, vec2 c)
  {
    return complexProduct(z, z) + c;
  }

  float mandelbrot(vec2 c, int maxIter)
  {
    vec2 z = c;
    for (int i = 0; i < maxIter; i++)
    {
      z = iter(z, c);

      if (length(z) > 2.0)
      {
        return float(i) / float(maxIter);
      }
    }
    return 1.0;
  }

  void main()
  {

    float x = vUv.x * 4.0 - 2.0;
    float y = vUv.y * 4.0 - 2.0;

    float t = mandelbrot(vec2(x, y), 100);

    vec3 innerColor = vec3(0., 0., 0.);
    vec3 outerColor = vec3(1., 1., 1.);


    gl_FragColor =  vec4(mix(innerColor, outerColor, t), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
})

export default material
