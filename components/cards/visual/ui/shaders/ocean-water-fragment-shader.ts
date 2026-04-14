export const oceanWaterFragmentShader = /* glsl */ `

    // fragmentShader
    varying vec2 vUv;
    varying float vWave;
    uniform float uTime;

    // simple noise function for "holes" in foam
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      // --- CONFIGURATION CONSTANTS ---
      vec3 depthColor = vec3(0.0, 0.05, 0.1);   // color in depth (dark)
      vec3 surfaceColor = vec3(0.0, 0.3, 0.4);  // color near the shore (light/turquoise)
      vec3 foamColor = vec3(1.0, 1.0, 1.0);     // foam color (white)

      float foamWidth = 0.02;          // basic foam strip width
      float foamTearStrength = 0.15;   // how much foam "breaks" at low tide
      float noiseScale = 100.0;        // foam bubble size (larger = smaller)
      float noiseSpeed = 0.1;          // foam flicker speed

      float waterOpacity = 0.85;       // overall water clarity
      float edgeSoftness = 0.15;       // how gently the water disappears at the very edge
      // ------------------------------

      // base color (gradient from depth to shore)
      float edge = smoothstep(0.1, 0.0, vUv.y);
      vec3 waterBaseColor = mix(depthColor, surfaceColor, edge);

      // noise for torn foam effect
      float noise = hash(vUv * noiseScale + uTime * noiseSpeed);

      // foam Break Logic (vWave as Phase Indicator)
      float breakAmount = smoothstep(0.5, -1.5, vWave) * foamTearStrength;
      float foamArea = smoothstep(foamWidth + breakAmount, 0.0, vUv.y + noise * breakAmount);

      // final color (mixing water and foam)
      float foamIntensity = clamp(foamArea * 2.0, 0.0, 1.0);
      vec3 finalColor = mix(waterBaseColor, foamColor, foamIntensity);

      // transparency (soft edge of the shore)
      float alpha = smoothstep(-0.1, edgeSoftness, vUv.y);

      csm_DiffuseColor = vec4(finalColor, waterOpacity * alpha);
    }

  `
