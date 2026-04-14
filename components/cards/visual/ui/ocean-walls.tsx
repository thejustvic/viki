import {RigidBody} from '@react-three/rapier'
import {useMemo, useRef} from 'react'
import {Color, DoubleSide, MeshBasicMaterial} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

interface Props {
  position: [number, number, number]
  rotation: [number, number, number]
  args: [number, number]
}
const OceanWall = ({position, rotation, args}: Props) => {
  const materialRef = useRef(null)

  const uniforms = useMemo(
    () => ({
      uWaterColor: {value: new Color('#001e33')},
      uDeepColor: {value: new Color('#001e33')}
    }),
    []
  )

  return (
    <RigidBody type="fixed">
      <mesh position={position} rotation={rotation} castShadow receiveShadow>
        <planeGeometry args={args} />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={MeshBasicMaterial}
          side={DoubleSide}
          uniforms={uniforms}
          vertexShader={`
            varying float vHeight;
            void main() {
              // here y is the height of the wall

              vHeight = position.y;
            }
          `}
          fragmentShader={`
            varying float vHeight;
            uniform vec3 uWaterColor;
            uniform vec3 uDeepColor;

            void main() {
              float depthFactor = smoothstep(-20.0, 0.0, vHeight);
              vec3 finalColor = mix(uDeepColor, uWaterColor, depthFactor);

              // in MeshBasicMaterial set the final color
              csm_DiffuseColor = vec4(finalColor, 1.0);
            }
          `}
        />
      </mesh>
    </RigidBody>
  )
}

export const OceanWalls = () => {
  return (
    <group>
      {/* left wall*/}
      <OceanWall
        position={[-500, 0, -4.7]}
        rotation={[0, Math.PI / 2, Math.PI]}
        args={[11, 900]}
      />
      {/* right wall */}
      <OceanWall
        position={[500, 0, -4.7]}
        rotation={[0, -Math.PI / 2, -Math.PI]}
        args={[11, 900]}
      />
      {/* back wall */}
      <OceanWall
        position={[0, 495, -4.7]}
        rotation={[-Math.PI / 2, -Math.PI, 0]}
        args={[1000, 11]}
      />
    </group>
  )
}
