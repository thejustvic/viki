export const Lights = () => (
  <>
    <ambientLight intensity={1} />
    <spotLight penumbra={0.5} position={[10, 10, 5]} castShadow />
  </>
)
