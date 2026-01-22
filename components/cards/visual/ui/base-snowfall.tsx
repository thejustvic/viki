import {useFrame} from '@react-three/fiber'
import {useEffect, useMemo, useRef} from 'react'
import {Euler, InstancedMesh, Object3D, Quaternion} from 'three'

const NUM_SNOWFLAKES = 5000
const SCENE_WIDTH = 50
const SNOW_RESET_Y = -5
const SNOW_START_Y_MAX = 30
const SCENE_BOTTOM = -5

export interface SnowflakeMeta {
  speed: number
  driftX: number
  driftZ: number
  spin: Quaternion
}

export const useSnowflakes = () => {
  return useMemo(() => {
    const pos = new Float32Array(NUM_SNOWFLAKES * 3)
    const meta: SnowflakeMeta[] = []

    for (let i = 0; i < NUM_SNOWFLAKES; i++) {
      // Initial Position
      pos[i * 3] = (Math.random() - 0.5) * SCENE_WIDTH
      pos[i * 3 + 1] =
        Math.random() * (SNOW_START_Y_MAX - SCENE_BOTTOM) + SCENE_BOTTOM
      pos[i * 3 + 2] = (Math.random() - 0.5) * SCENE_WIDTH

      // Pre-calculate a rotation Quaternion to represent the "spin" per frame
      const spin = new Quaternion().setFromEuler(
        new Euler(
          Math.random() * 0.02,
          Math.random() * 0.02,
          Math.random() * 0.02
        )
      )

      meta.push({
        speed: 2 + Math.random() * 4, // Units per second
        driftX: (Math.random() - 0.5) * 0.5,
        driftZ: (Math.random() - 0.5) * 0.5,
        spin: spin
      })
    }

    return {positions: pos, snowflakeMeta: meta}
  }, [])
}

export const Snowfall = () => {
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  // 1. Setup Data
  const {positions, snowflakeMeta} = useSnowflakes()

  // 2. Initial Matrix Placement
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }
    for (let i = 0; i < NUM_SNOWFLAKES; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      )
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [dummy, positions])

  // 3. Animation Loop
  useFrame((_state, delta) => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    for (let i = 0; i < NUM_SNOWFLAKES; i++) {
      const meta = snowflakeMeta[i]

      // Update values using delta for frame-rate independence
      positions[i * 3] += meta.driftX * delta
      positions[i * 3 + 1] -= meta.speed * delta
      positions[i * 3 + 2] += meta.driftZ * delta

      if (positions[i * 3 + 1] < SNOW_RESET_Y) {
        positions[i * 3 + 1] = SNOW_START_Y_MAX
      }
      // Update Dummy
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      )
      // Apply pre-calculated spin
      dummy.quaternion.multiply(meta.spin)

      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_SNOWFLAKES]}>
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshBasicMaterial color="white" transparent opacity={0.7} />
    </instancedMesh>
  )
}
