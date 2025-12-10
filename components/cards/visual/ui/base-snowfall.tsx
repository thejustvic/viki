import {useFrame} from '@react-three/fiber'
import React, {useEffect, useMemo, useRef} from 'react'
import * as THREE from 'three'
import {InstancedMesh} from 'three'

const NUM_SNOWFLAKES = 5000
const SCENE_WIDTH = 50
const SNOW_RESET_Y = -5
const SNOW_START_Y_MIN = 20
const SNOW_START_Y_MAX = 30

// Define the type for a single snowflake's dynamic data
interface Snowflake {
  speed: number
  driftX: number // Constant horizontal drift amount (wind effect)
  driftZ: number // Constant horizontal drift amount (wind effect)
  rotationSpeed: THREE.Euler
}

export const Snowfall: React.FC = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const rotationQuaternion = useMemo(() => new THREE.Quaternion(), [])

  const snowflakes = useMemo((): Snowflake[] => {
    const tempSnowflakes: Snowflake[] = []
    for (let i = 0; i < NUM_SNOWFLAKES; i++) {
      tempSnowflakes.push({
        speed: 0.1 + Math.random() * 0.1,
        driftX: (Math.random() - 0.5) * 0.03,
        driftZ: (Math.random() - 0.5) * 0.03,
        // Initialize rotation speed as a new Euler object with random initial rotation rates
        rotationSpeed: new THREE.Euler(
          Math.random() * 0.01,
          Math.random() * 0.01,
          Math.random() * 0.01
        )
      })
    }
    return tempSnowflakes
  }, [])

  // Initialize instance positions immediately after mount/layout
  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < NUM_SNOWFLAKES; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * SCENE_WIDTH,
        Math.random() * (SNOW_START_Y_MAX - SNOW_START_Y_MIN) +
          SNOW_START_Y_MIN,
        (Math.random() - 0.5) * SCENE_WIDTH
      )
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [dummy])

  useFrame(() => {
    if (!meshRef.current) return

    snowflakes.forEach((snowflake, i) => {
      meshRef.current.getMatrixAt(i, dummy.matrix)

      // Decompose matrix: Use dummy.quaternion for proper matrix decomposition
      // We fixed the TS error in the previous step using .quaternion here:
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)

      // --- Core Movement Logic (Pure Translation) ---
      dummy.position.y -= snowflake.speed
      dummy.position.x += snowflake.driftX
      dummy.position.z += snowflake.driftZ

      // Apply consistent, gentle rotation (tumbling effect)
      rotationQuaternion.setFromEuler(snowflake.rotationSpeed)
      dummy.quaternion.multiplyQuaternions(dummy.quaternion, rotationQuaternion)

      // Reset logic
      if (dummy.position.y < SNOW_RESET_Y) {
        dummy.position.y =
          Math.random() * (SNOW_START_Y_MAX - SNOW_START_Y_MIN) +
          SNOW_START_Y_MIN
        dummy.position.x = (Math.random() - 0.5) * SCENE_WIDTH
        dummy.position.z = (Math.random() - 0.5) * SCENE_WIDTH
      }

      // Recompose the matrix and set it back to the instance
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_SNOWFLAKES]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="white" transparent opacity={0.8} />
    </instancedMesh>
  )
}
