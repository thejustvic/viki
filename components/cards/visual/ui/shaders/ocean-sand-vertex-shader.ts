export const oceanSandVertexShader = `
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vDepth = position.z;
  }
`
