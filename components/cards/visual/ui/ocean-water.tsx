import {useFrame, useLoader} from '@react-three/fiber'
import {useMemo, useRef} from 'react'
import {
  Color,
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
  waterNormals.repeat.set(50, 10)

  // creating Uniforms to pass time to the shader
  const uniforms = useMemo(
    () => ({
      uTime: {value: 0},
      uTexture: {value: waterNormals},
      uWaveSpeed: {value: 1.5},
      uWaveFrequency: {value: 0.2},
      uWaveHorizontal: {value: 1.8},
      uWaveVertical: {value: 0.5},
      uShoreRadius: {value: 100.0}, // island radius
      uCalmZoneStart: {value: 0.01},

      uDepthColor: {value: new Color('#001e33')},
      uSurfaceColor: {value: new Color('#004d66')},
      uFoamColor: {value: new Color('#ffffff')},
      uFogColor: {value: new Color('#001e33')},

      // setting the foam and transparency
      uFoamWidth: {value: 20.0},
      uFoamTearStrength: {value: 1.0},
      uNoiseScale: {value: 100.1},
      uNoiseSpeed: {value: 1.1},
      uWaterOpacity: {value: 0.85}
    }),
    [waterNormals]
  )

  useFrame(state => {
    uniforms.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <mesh>
      {/* 256x256 segments for smooth 3D waves */}
      <planeGeometry args={[1000, 1000, 256, 256]} />
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
