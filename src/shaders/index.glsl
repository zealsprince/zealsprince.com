/*
    Adapted from "Singularity" by @XorDev

    Original Shadertoy: https://www.shadertoy.com/view/MsSSWV
*/

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_offset;
uniform float u_iterations;
uniform float u_offset_skew;
uniform float u_offset_waves;
uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform vec2 u_mouse;
// Level the wave is subtracted from for the light theme's near-white field
uniform float u_base;
// 0: light field, dark waves. 1: dark field, lit waves.
uniform float u_polarity;
// Dark theme only. Gamma applied to the normalised field. Higher crushes the
// mid tones toward black while leaving the peaks, which is what reads as
// contrast rather than just dimness.
uniform float u_gamma;

varying vec2 vUv;

void main() {
  // Iterator and attenuation (distance-squared)
  float i = .15, a;

  // Resolution for scaling and centering
  vec2
      r = u_resolution.xy,
      // Centered ratio-corrected coordinates using UV, applying zoom and offset
      p = (((vUv + u_offset) * 1.5 - 1.) * vec2(r.x / r.y, 1.1)) /
          (1.25 * u_zoom),

      // Diagonal vector for skewing
      d = vec2(-1, 1) * u_offset_skew,

      // Rotate around center
      b = p - i * d,

      // Rotate and apply perspective
      c = p * mat2(1, 1, d / (.1 + i / dot(b, b))),

      // Rotate into spiraling coordinates
      v = c *
          mat2(cos(.5 * log(a = dot(c, c)) + (u_time / 2.) * i +
                   vec4(0, 33, 11, 0))) /
          i,

      // Waves cumulative total for coloring
      w;

  // Loop through waves
  for (; i++ < u_iterations; w += 1. + sin(v))
    // Distort coordinates
    v += .7 * sin(v.yx * i + (u_time / 2.)) / i +
         .5 * u_offset_waves * (-vec2(.5));

  // Red/blue gradient
  vec4 wave = exp(-exp(c.x * vec4(u_red, u_green, u_blue, -2.))
                  // Wave coloring
                  / w.yxxy
                  // Edge darkness
                  / (a));

  // Light theme: wave reads as ink on a near-white field.
  vec4 field = u_base - wave;

  // Dark theme: normalise against u_base, then gamma. A fixed black point or a
  // straight inversion both fail, because the field's range swings with the
  // random uniforms, so one seed goes black and the next blows out. Gamma is
  // relative, so it holds its contrast across every seed.
  vec4 lit = pow(clamp(field / u_base, 0., 1.), vec4(u_gamma));

  gl_FragColor = mix(field, lit, u_polarity);

  // The canvas composites over the page (alpha: true, premultiplied), so the
  // light theme's varying alpha is part of its look. Keep it untouched there
  // and only force opacity for the dark theme.
  gl_FragColor.a = mix(field.a, 1., u_polarity);
}
