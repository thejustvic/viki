export const oceanSandFragmentShader = `
  varying vec2 vUv;
  varying float vDepth; // on the shore = 0, at depth = -5
  uniform float uTime;
  uniform sampler2D uCausticsTex;
  uniform vec3 uWaterColor;

  void main() {
    // create a dive mask
    // smoothstep(upper bound, lower bound, value)
    // 0.0 — dry, 1.0 — completely underwater (at a depth of -1.0 and below)
    float underwaterMask = smoothstep(0.0, -1.0, vDepth);

    // caustic calculation
    vec2 uv1 = vUv * 8.0 + vec2(uTime * 0.02, uTime * 0.01);
    vec2 uv2 = vUv * 8.0 + vec2(uTime * -0.015, uTime * 0.02);
    float finalCaustic = min(texture2D(uCausticsTex, uv1).r, texture2D(uCausticsTex, uv2).r);

    // mix the base color of the sand with the color of the water
    // if underwaterMask = 0 (shore), the original sand color remains
    vec3 sandColor = csm_DiffuseColor.rgb;
    vec3 tintedColor = mix(sandColor, sandColor * uWaterColor, underwaterMask);

    // add caustic only where there is water (underwaterMask)
    // also make it weaker at great depths (-5.0)
    float depthFade = smoothstep(-5.0, -0.5, vDepth);
    vec3 finalRGB = tintedColor + (finalCaustic * underwaterMask * depthFade * 0.5);

    csm_DiffuseColor = vec4(finalRGB, 1.0);
  }
`
