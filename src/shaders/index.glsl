/*
    Adapted from "Singularity" by @XorDev

    Original Shadertoy: https://www.shadertoy.com/view/MsSSWV
*/

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_iterations;
uniform float u_offset_skew;
uniform float u_offset_waves;
uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform vec2 u_mouse;

varying vec2 vUv;

void main()
{
  // Iterator and attenuation (distance-squared)
  float i = .15, a;

  //Resolution for scaling and centering
  vec2 r = u_resolution.xy,
    // Centered ratio-corrected coordinates using UV
    p = ( (vUv * 1.7 - 1.1) * vec2(r.x / r.y, 1.5) ) / 1.25,

    // Diagonal vector for skewing
    d = vec2(-1,1) * u_offset_skew,

    // Rotate around center
    b = p - i * d,

    // Rotate and apply perspective
    c = p * mat2(1, 1, d / (.1 + i / dot(b,b))),

    // Rotate into spiraling coordinates
    v = c * mat2(cos(.5 * log( a = dot(c,c)) + u_time * i + vec4(0,33,11,0))) / i,

    // Waves cumulative total for coloring
    w;

  //Loop through waves
  for(; i++ < u_iterations; w += 1. + sin(v) )
    //Distort coordinates
    v += .7 * sin(v.yx * i + u_time) / i + .5 * u_offset_waves * (- vec2(.5));

  //Red/blue gradient
  gl_FragColor = 1.5 - exp( -exp( c.x * vec4(u_red, u_green, u_blue, -2.))
    //Wave coloring
    /  w.xyyx
    // Edge darkness
    / ( 2. * a )
  );
}
