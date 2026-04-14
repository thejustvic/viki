export const oceanWaterVertexShader = /* glsl */ `

    // vertexShader
    varying vec2 vUv;
    varying float vWave;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // --- SETTING CONSTANTS---
      float waveSpeed = 1.5;            // wave speed
      float waveFrequency = 0.2;        // frequency (the lower, the longer the waves)
      float waveHorizontal = 2.8;       // rollover force (forward-backward)
      float waveVertical = 0.5;         // wave height (z volume)
      float shoreCurveStrength = 1.8;   // shore curvature force
      float calmZoneStart = 0.01;       // where do 3D waves start to disappear (0.0 - 1.0)
      // ------------------------------

      // PHASE AND BASE WAVE
      float phase = pos.y * waveFrequency + uTime * waveSpeed;

      // VOLUME MASK (Z)
      float calmMask = smoothstep(0.0, calmZoneStart, vUv.y);

      // HORIZONTAL ROLL (Y)
      float wave = sin(phase) * waveHorizontal;

      // VERTICAL VOLUME (Z)
      float height = pow(cos(phase + 1.2) * 0.5 + 0.5, 3.0) * waveVertical * calmMask;

      // CURVED COAST
      float shoreCurve = (sin(pos.x * 0.001) * shoreCurveStrength) + (cos(pos.x * 1.4) * 0.5);
      float edgeMask = smoothstep(0.4, 0.0, vUv.y);
      float sideMask = smoothstep(1000.0, 50.0, abs(pos.x));

      float totalDisplacement = wave + (shoreCurve * edgeMask * sideMask);
      vWave = totalDisplacement;

      pos.y += totalDisplacement;
      pos.z += height;

      csm_Position = pos;
    }

  `
