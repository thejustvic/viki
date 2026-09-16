'use client'
import {Center, Text3D} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {useEffect, useRef, useState} from 'react'
import {Mesh} from 'three'
import {JellyfishGrid} from '../cards/visual/ui/jellyfish-grid'
import {CANOPY_CONFIG, CanopyParams} from './canopy-config'
import {CanopyScene} from './canopy-scene'

interface CanopyConfiguratorProps {
  config: CanopyParams
}

export const CanopyCanvas = ({config}: CanopyConfiguratorProps) => {
  // 1. create the object IMMEDIATELY during state initialization (synchronously)
  const [canopyInstance] = useState(() => new CanopyScene())
  const [isReady, setIsReady] = useState(false)

  // 2. effect for asynchronous asset loading
  useEffect(() => {
    let isMounted = true

    void canopyInstance.initContext().then(() => {
      if (isMounted) {
        setIsReady(true) // assets are ready, you can build geometry
      }
    })

    return () => {
      isMounted = false
      // here you can optionally call canopyInstance.dispose() if there is anything to clean up in memory
    }
  }, [canopyInstance])

  // 3. effect for updating geometry when changing config OR when assets are ready
  useEffect(() => {
    if (isReady) {
      canopyInstance.update(config)
    }
  }, [config, isReady, canopyInstance])

  // pass group instance to a primitive. Now React knows exactly when to render it
  return <>{!isReady ? <Loader3D /> : <primitive object={canopyInstance} />}</>
}

const Loader3D = () => {
  const meshRef = useRef<Mesh>(null)

  // make the loader roll (wobble) smoothly from side to side
  useFrame(state => {
    if (meshRef.current) {
      // 1. get the total time elapsed since the start (in seconds)
      const time = state.clock.getElapsedTime()

      // 2. сonfiguring motion parameters
      const speed = 2 // oscillation speed (the higher, the faster)
      const amplitude = 0.4 // amplitude (tilt angle, 0.4 radians is approximately 23 degrees)

      // Math.sin(time * speed) returns a value from -1 to 1, which multiply by the amplitude
      meshRef.current.rotation.z = Math.sin(time * speed) * amplitude
    }
  })

  return (
    <group position={[0, 1, 0]}>
      <mesh ref={meshRef}>
        <Center>
          <Text3D
            font={'/OpenSans_Regular.json'}
            size={0.3}
            height={0.02}
            bevelEnabled
            bevelSize={0.01}
            bevelThickness={0.01}
            curveSegments={1}
            bevelSegments={1}
          >
            LOADING...
            <meshStandardMaterial color="red" />
          </Text3D>
        </Center>
      </mesh>
    </group>
  )
}

interface CanopyProps {
  currentDepth?: number
}
export const Canopy = ({currentDepth = 10}: CanopyProps) => {
  // dynamically calculate the Z-position based on currentDepth
  // when currentDepth = 5  => Z = 102.5 - 0.5 * 5  = 100
  // when currentDepth = 50 => Z = 102.5 - 0.5 * 50 = 77.5
  const zValue = 102.5 - 0.5 * currentDepth

  // roof dimensions
  const width = 5
  const height = 4

  const jellyfishBoundaries = 1.5

  return (
    <group position={[0, 0, zValue]}>
      <CanopyCanvas config={{width, height, depth: currentDepth}} />

      {/* a group of jellyfish lifted to roof height */}
      <group position={[0, height - jellyfishBoundaries, 0]}>
        <JellyfishGrid
          width={width - jellyfishBoundaries}
          depth={currentDepth - jellyfishBoundaries}
        />
      </group>

      {/* plane for jellyfish */}
      <mesh
        position={[0, height, 0]}
        // rotate it 90 degrees (Math.PI / 2) around the X-axis to lay it horizontally
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {/* plane has only two dimensions */}
        <planeGeometry
          args={[
            width - CANOPY_CONFIG.OVERHANG * 2,
            currentDepth - CANOPY_CONFIG.OVERHANG * 2
          ]}
        />
        {/* change opacity to see the plate */}
        <meshBasicMaterial
          color="#00ffcc"
          transparent={true}
          opacity={0} // 0.3 value is semi-transparent, to see the boundaries
          side={2} // DoubleSide from three.js (value 2), so that the plane is visible from both sides
        />
      </mesh>
    </group>
  )
}
