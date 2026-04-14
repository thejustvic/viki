export const oceanWaterFragmentShader = /* glsl */ `
    varying vec2 vUv;
    varying float vWave;
    varying vec3 vWorldPosition; // added in vertex shader to use here
    uniform float uTime;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      // --- CONFIGURATION CONSTANTS ---
      vec3 depthColor = vec3(0.0, 0.05, 0.1);   // color in depth (dark)
      vec3 surfaceColor = vec3(0.0, 0.3, 0.4);  // color near the shore (light/turquoise)
      vec3 foamColor = vec3(1.0, 1.0, 1.0);     // foam color (white)
      vec3 fogColor = vec3(0.0, 0.02, 0.05);    // very dark blue

      float foamWidth = 0.02;          // basic foam strip width
      float foamTearStrength = 0.15;   // how much foam "breaks" at low tide
      float noiseScale = 100.0;        // foam bubble size (larger = smaller)
      float noiseSpeed = 0.1;          // foam flicker speed

      float waterOpacity = 0.85;       // overall water clarity
      float edgeSoftness = 0.15;       // how gently the water disappears at the very edge
      // ------------------------------

      // base color of water
      float edge = smoothstep(0.1, 0.0, vUv.y);
      vec3 waterBaseColor = mix(depthColor, surfaceColor, edge);

      // foam logic
      float noise = hash(vUv * noiseScale + uTime * noiseSpeed);
      float breakAmount = smoothstep(0.5, -1.5, vWave) * foamTearStrength;
      float foamArea = smoothstep(foamWidth + breakAmount, 0.0, vUv.y + noise * breakAmount);
      float foamIntensity = clamp(foamArea * 2.0, 0.0, 1.0);
      vec3 finalColor = mix(waterBaseColor, foamColor, foamIntensity);

      // calculation of fog at a distance (Skirt)
      // radius from the center of the world
      float dist = length(vWorldPosition.xz);

      // start to fog from 0 to 500 units
      float radialFog = smoothstep(0.0, 500.0, dist);

      // altitude dive (below 0.0)
      float heightFog = smoothstep(0.0, -10.0, vWorldPosition.y);

      // combine: fog is activated either at a distance or at depth
      float fogMix = max(radialFog, heightFog);
      fogMix = clamp(fogMix, 0.0, 1.0);

      vec3 colorWithFog = mix(finalColor, fogColor, fogMix);

      // transparency: soft shore + full opacity at the edge of fog
      float alpha = smoothstep(-0.1, edgeSoftness, vUv.y);
      float finalAlpha = mix(waterOpacity * alpha, 1.0, fogMix);

      csm_DiffuseColor = vec4(colorWithFog, finalAlpha);
    }
`
