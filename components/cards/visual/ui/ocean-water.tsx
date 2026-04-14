import {useFrame, useLoader} from '@react-three/fiber'
import {useMemo, useRef} from 'react'
import {
  DoubleSide,
  MeshStandardMaterial,
  RepeatWrapping,
  TextureLoader
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import {oceanWaterFragmentShader} from './shaders/ocean-water-fragment-shader'
import {oceanWaterVertexShader} from './shaders/ocean-water-vertex-shader'

export const OceanWater = () => {
  const materialRef = useRef(null)

  // textures of normals for the shine of water
  const waterNormals = useLoader(TextureLoader, '/textures/waternormals.jpg')
  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping
  waterNormals.repeat.set(100, 70)

  // creating Uniforms to pass time to the shader
  const uniforms = useMemo(
    () => ({
      uTime: {value: 0},
      uTexture: {value: waterNormals}
    }),
    [waterNormals]
  )

  useFrame(state => {
    uniforms.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <mesh>
      {/* 128x128 segments for smooth 3D waves */}
      <planeGeometry args={[1000, 700, 128, 128]} />
      <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={MeshStandardMaterial}
        vertexShader={oceanWaterVertexShader}
        fragmentShader={oceanWaterFragmentShader}
        uniforms={uniforms}
        normalMap={waterNormals}
        side={DoubleSide}
        // standard water props
        roughness={0.1}
        metalness={0}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}
