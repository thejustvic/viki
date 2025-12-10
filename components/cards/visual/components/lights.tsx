export const Lights = () => (
  <>
    <ambientLight intensity={1} />
    <directionalLight
      position={[5, 10, 5]}
      intensity={0.8}
      castShadow
      shadow-mapSize={[2048, 2048]} // increase shadow map resolution
      shadow-camera-near={0.1}
      shadow-camera-far={50}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
    />
  </>
)
