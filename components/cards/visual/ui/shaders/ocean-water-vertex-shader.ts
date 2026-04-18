export const oceanWaterVertexShader = /* glsl */ `
    varying vec2 vUv;
    varying float vWave;
    varying vec3 vWorldPosition;
    varying float vDist;

    uniform float uTime;
    uniform float uWaveSpeed;
    uniform float uWaveFrequency;
    uniform float uWaveHorizontal;
    uniform float uWaveVertical;
    uniform float uShoreRadius;
    uniform float uCalmZoneStart;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // DISTANCE CALCULATION
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      float dist = length(worldPos.xz);
      vDist = dist;

      // PHASE AND MASK (movement to the center)
      // using dist to create rings
      float phase = (dist - uShoreRadius) * uWaveFrequency + uTime * uWaveSpeed;

      // waves fading near the very shore of the island
      float calmMask = smoothstep(uShoreRadius - 5.0, uShoreRadius + 20.0, dist);

      // HORIZONTAL ROLL
      // in a radial system, this is a displacement along the radius
      float wave = sin(phase) * uWaveHorizontal * calmMask;

      // VERTICAL VOLUME (Z)
      float height = pow(cos(phase + 1.2) * 0.5 + 0.5, 3.0) * uWaveVertical * calmMask;

      // MERGER AND DISPLACEMENT
      // vWave passes data for the foam to the fragment shader
      vWave = wave + height;

      // calculating the direction from center to vertex for horizontal displacement
      vec2 dir = normalize(pos.xy);

      // add a horizontal wave to the position
      pos.x += dir.x * wave;
      pos.y += dir.y * wave;

      // add vertical volume and Skirt (immersion of the edges of the world)
      float skirtAlpha = smoothstep(480.0, 500.0, dist);
      float skirtDepth = skirtAlpha * -12.0;
      pos.z += height + skirtDepth;

      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      csm_Position = pos;
    }
`
