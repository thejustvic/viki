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
      // cut off everything beyond a radius of 500
      if (vDist > 500.0) discard;

      // BASIC COLOR
      float edge = smoothstep(uShoreRadius + 50.0, uShoreRadius, vDist);
      vec3 waterBaseColor = mix(uDepthColor, uSurfaceColor, edge);

      // FOAM LOGIC
      float noise = hash(vUv * uNoiseScale + uTime * uNoiseSpeed);
      // calculate the distance from the current point to the shore
      float foamDist = abs(vDist - uShoreRadius);

      // add a wave effect (vWave) to make the foam "move" with the crest
      float waveEffect = vWave * uFoamTearStrength * 10.0;

      // radial foam using uFoamWidth
      // draw a white ring
      // use uFoamWidth (e.g. 15.0) to make the foam visible
      float foamArea = smoothstep(uFoamWidth + waveEffect, 0.0, foamDist);
      float foamIntensity = clamp(foamArea * 0.2, 0.0, 1.0);

      vec3 finalColor = mix(waterBaseColor, uFoamColor, foamIntensity);

      // FOG AND IMMERSION
      float radialFog = smoothstep(400.0, 500.0, vDist);
      float heightFog = smoothstep(0.0, -10.0, vWorldPosition.y);
      float fogMix = clamp(max(radialFog, heightFog), 0.0, 1.0);

      vec3 colorWithFog = mix(finalColor, uFogColor, fogMix);

      // TRANSPARENCY
      // the water becomes transparent only where there is an island (vDist < uShoreRadius)
      float alphaMask = smoothstep(uShoreRadius - 2.0, uShoreRadius + 15.0, vDist);

      // final transparency with fog included (fogMix makes water opaque on the horizon)
      float finalAlpha = mix(uWaterOpacity * alphaMask, 1.0, fogMix);

      csm_DiffuseColor = vec4(colorWithFog, finalAlpha);
    }
`
