import { useControls } from 'leva'
import { DoubleSide, ShaderMaterial } from 'three'

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
  uniform float uTime;
  uniform float uWidth;
  uniform float uHeight;
  uniform float uX1;
  uniform float uY1;
  uniform float uX2;
  uniform float uY2;

  const float PI = 3.14159265358979323846264;

  //	Simplex 4D Noise
  //	by Ian McEwan, Ashima Arts
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

  vec4 grad4(float j, vec4 ip){
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
  }

  float snoise(vec4 v){
    const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                          0.309016994374947451); // (sqrt(5) - 1)/4   F4
    // First corner
    vec4 i  = floor(v + dot(v, C.yyyy) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    // Other corners

    // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;

    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;

    //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;

    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    //  x0 = x0 - 0.0 + 0.0 * C
    vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
    vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
    vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
    vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

    // Permutations
    i = mod(i, 289.0);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
              i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
            + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
    // Gradients
    // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    // Mix contributions from the five corners
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

  float tileableNoise(vec2 uv, float width, float height, float x1, float y1, float x2, float y2)
  {
    float s = uv.x / width;
    float t = uv.y / height;

    float dx = x2 - x1;
    float dy = y2 - y1;

    float nx = x1 + cos(s * 2.0 * PI) * dx / (2.0 * PI);
    float ny = y1 + sin(t * 2.0 * PI) * dy / (2.0 * PI);
    float nz = x1 + sin(s * 2.0 * PI) * dx / (2.0 * PI);
    float nw = y1 + cos(t * 2.0 * PI) * dy / (2.0 * PI);

    return snoise(vec4(nx, ny, nz, nw));
  }

  void main()
  {
    float i = tileableNoise(vUv, uWidth, uHeight, uX1, uY1, uX2, uY2);

    gl_FragColor = vec4(vec3(i), 1.0);
  }
`

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uWidth: { value: 1 },
    uHeight: { value: 1 },
    uX1: { value: 1 },
    uX2: { value: 2 },
    uY1: { value: 1 },
    uY2: { value: 2 },
  },
  transparent: true,
})

export default material
