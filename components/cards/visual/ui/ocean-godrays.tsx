import {useFrame} from '@react-three/fiber'
import {useMemo, useRef} from 'react'
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  IUniform,
  Mesh,
  ShaderMaterial
} from 'three'

interface GodRaysProps {
  color?: string
  intensity?: number
}
const SingleRay = ({
  position,
  uniforms
}: {
  position: [number, number, number]
  uniforms: GodRayUniforms
}) => {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial & {uniforms: GodRayUniforms}>(null)

  useFrame(state => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(t * 0.5 + position[0]) * 0.05
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/*
        args: [radius top, radius bottom, height, ...]
      */}
      <cylinderGeometry args={[1, 15, 10, 32, 1, true]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={DoubleSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uIntensity;
          void main() {
            // vUv.y goes from bottom to top. 1.0 is top, 0.0 is bottom.
            float vMask = pow(vUv.y, 2.0);
            float rays = sin(vUv.x * 20.0 + uTime * 0.5) * 0.5 + 0.5;
            float edgeFade = sin(vUv.x * 3.1415);
            gl_FragColor = vec4(uColor, vMask * rays * edgeFade * uIntensity);
          }
        `}
      />
    </mesh>
  )
}
interface GodRayUniforms {
  uTime: IUniform<number>
  uColor: IUniform<Color>
  uIntensity: IUniform<number>
  [uniform: string]: IUniform
}
export const OceanGodRays = ({
  color = '#44aaff',
  intensity = 0.3
}: GodRaysProps) => {
  const uniforms: GodRayUniforms = useMemo(
    () => ({
      uTime: {value: 0},
      uColor: {value: new Color(color)},
      uIntensity: {value: intensity}
    }),
    [color, intensity]
  )

  const positions: [number, number, number][] = [
    [-20, 20, -5],
    [20, 20, -5]
  ]

  return (
    <group>
      {positions.map((pos, i) => (
        <SingleRay key={i} position={pos} uniforms={uniforms} />
      ))}
    </group>
  )
}
