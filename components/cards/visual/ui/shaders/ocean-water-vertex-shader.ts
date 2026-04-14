export const oceanWaterVertexShader = /* glsl */ `
    varying vec2 vUv;
    varying float vWave;
    varying vec3 vWorldPosition; // add for fragment shader
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
      float calmMask = smoothstep(0.0, calmZoneStart, vUv.y);

      // HORIZONTAL ROLL (Y)
      float wave = sin(phase) * waveHorizontal;

      // VERTICAL VOLUME (Z)
      float height = pow(cos(phase + 1.2) * 0.5 + 0.5, 3.0) * waveVertical * calmMask;

      // CURVED COAST
      float shoreCurve = (sin(pos.x * 0.001) * shoreCurveStrength) + (cos(pos.x * 1.4) * 0.5);
      float edgeMask = smoothstep(0.8, 0.0, vUv.y);
      float sideMask = smoothstep(1000.0, 30.0, abs(pos.x));

      float totalDisplacement = wave + (shoreCurve * edgeMask * sideMask);
      vWave = totalDisplacement;

      pos.y += totalDisplacement;

      // CALCULATION OF WORLD COORDINATES (before edge immersion)
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);

      // radius from the center of the world (0.0)
      float dist = length(worldPos.xz);

      // SKIRT EFFECT
      // start the dive a little earlier (490) to make the transition smooth
      float skirtAlpha = smoothstep(490.0, 500.0, dist);
      float skirtDepth = skirtAlpha * -30.0; // going deeper for reliability

      pos.z += height + skirtDepth;

      // update the world position (now Y in the world is the height after the offsets)
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

      csm_Position = pos;
    }
`
