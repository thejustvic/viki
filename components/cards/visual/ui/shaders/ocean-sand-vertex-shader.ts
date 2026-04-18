export const oceanSandVertexShader = `
  varying float vDist;
  varying float vDepth;
  varying vec2 vUv;

  void main() {
      vUv = uv;
      vDepth = position.z; // depth of landscape

      // calculate the distance from the center of the mesh
      vDist = length(position.xy);

      csm_Position = position;
  }
`
