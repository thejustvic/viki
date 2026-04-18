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

    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    // simple angle-based noise for a radial system
    float noise(float angle) {
        float i = floor(angle);
        float f = fract(angle);
        return mix(hash(i), hash(i + 1.0), smoothstep(0.0, 1.0, f));
    }

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



      // --- EFFECT OF A BREAKING WATERFALL WITH A BEND ---

      float angle = atan(pos.y, pos.x);
      float waterfallNoise = noise(angle * 60.0 + uTime * 0.5);
      float jaggedEffect = pow(waterfallNoise, 2.0);

      // waterfall Mask (480m - 500m)
      float skirtAlpha = smoothstep(480.0, 500.0, dist);

      // VERTICAL DROP
      // base height of the waterfall start
      float startY = -30.0;
      // additional depth of fall of the "tail" itself
      float fallDepth = -50.0;

      // depth calculation: smoothly go to -30, and then sharply down
      // skirtAlpha * startY is the rounding to -30
      // pow(skirtAlpha, 3.0) * fallDepth * jaggedEffect ---- is a jagged tip
      float skirtDepth = (skirtAlpha * startY) + (pow(skirtAlpha, 4.0) * fallDepth * jaggedEffect);

      // THE EFFECT OF BENDING INSIDE
      // activates more strongly when altitude drops below -30
      float inwardCurve = skirtAlpha * 20.0;
      vec2 dirToCenter = normalize(pos.xy);

      pos.x -= dirToCenter.x * inwardCurve;
      pos.y -= dirToCenter.y * inwardCurve;

      // final height
      pos.z += height + skirtDepth;

      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      csm_Position = pos;
    }
`
