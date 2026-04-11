/* eslint-disable max-lines-per-function */
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
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 11]} />
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
            vec3 pos = position;

            // tilt the beam depending on the height (vUv.y)
            // the lower (less y), the stronger the x-shift

            float tilt = 5.0;
            pos.x += (1.0 - uv.y) * tilt;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          // fragmentShader
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uIntensity;

          void main() {
            // create very thin vertical stripes
            // increase the frequency (120.0) and raise it to the power (20.0) for sharpness

            float needleBase = sin(vUv.x * 120.0 + uTime * 0.5) * 0.5 + 0.5;
            float needles = pow(needleBase, 20.0); // the higher the grade, the thinner the needles.

            // add a second layer for unevenness (shimmer)

            float noise = sin(vUv.x * 30.0 - uTime * 0.3) * 0.5 + 0.5;
            float finalNeedles = needles * noise;

            // smooth fading from top (vUv.y = 1) and bottom (vUv.y = 0)
            // the needles should "grow" from a point on top.

            float verticalFade = smoothstep(0.0, 0.15, vUv.y) * pow(1.0 - vUv.y, 2.0);

            // masking the side seams

            float edgeFade = sin(vUv.x * 3.1415);

            float alpha = finalNeedles * verticalFade * edgeFade * uIntensity;

            gl_FragColor = vec4(uColor, alpha);
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

  const positions: [number, number, number][] = [[0, 44, -5]]

  return (
    <group>
      {positions.map((pos, i) => (
        <SingleRay key={i} position={pos} uniforms={uniforms} />
      ))}
    </group>
  )
}
