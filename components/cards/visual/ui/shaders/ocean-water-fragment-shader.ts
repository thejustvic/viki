export const oceanWaterFragmentShader = /* glsl */ `
    varying vec2 vUv;
    varying float vWave;
    varying vec3 vWorldPosition;
    varying float vDist;

    uniform float uTime;

    uniform vec3 uDepthColor;
    uniform vec3 uSurfaceColor;
    uniform vec3 uFoamColor;
    uniform vec3 uFogColor;

    uniform float uFoamWidth;
    uniform float uFoamTearStrength;
    uniform float uNoiseScale;
    uniform float uNoiseSpeed;
    uniform float uWaterOpacity;
    uniform float uShoreRadius;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      // CUT THE WATER ALONG A RADIUS
      if (vDist > 500.0) discard;

      // BASIC COLOR AND SURF NEAR THE ISLAND
      float edge = smoothstep(uShoreRadius + 100.0, uShoreRadius, vDist);
      vec3 waterBaseColor = mix(uDepthColor, uSurfaceColor, edge);

      float noise = hash(vUv * uNoiseScale + uTime * uNoiseSpeed);
      float foamDist = abs(vDist - uShoreRadius);
      float waveEffect = vWave * uFoamTearStrength * 10.0;
      float foamArea = smoothstep(uFoamWidth + waveEffect, 0.0, foamDist);
      float foamIntensity = clamp(foamArea * 0.2, 0.0, 1.0);

      // color of the water with the surf near the shore
      vec3 finalRGB = mix(waterBaseColor, uFoamColor, foamIntensity);

      // WATERFALL FOAM
      // draw white strands at the very edge
      float waterfallFoam = smoothstep(493.0, 500.0, vDist);
      float dynamicFoam = waterfallFoam * (0.6 + noise * 0.4);

      // applying foam to the waterfall
      finalRGB = mix(finalRGB, uFoamColor, dynamicFoam * 0.9);

      // TRANSPARENCY
      // smooth appearance of water near the shore of the island
      float alphaMask = smoothstep(uShoreRadius - 2.0, uShoreRadius + 20.0, vDist);

      // make the water opaque at the very edge of the waterfall for clarity of the jets
      float finalAlpha = mix(uWaterOpacity * alphaMask, 1.0, waterfallFoam);

      csm_DiffuseColor = vec4(finalRGB, finalAlpha);
    }

`
