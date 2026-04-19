/* eslint-disable max-lines-per-function */
import {useFrame} from '@react-three/fiber'
import {useMemo, useRef} from 'react'
import {AdditiveBlending, InstancedMesh, Object3D, Vector3} from 'three'

interface PlanktonProps {
  count?: number
}

const toTubeCenterRadius = 300 // radius to the center of the tube
const tubeRadius = 120 // radius of the tube itself
const yScale = 0.04 // flattening scale

export const OceanPlankton = ({count = 10000}: PlanktonProps) => {
  const meshRef = useRef<InstancedMesh>(null)
  // create an array of random positions and velocities for particles
  const particles = useMemo(() => {
    const temp = []

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200

      // angle around the center of the bagel (base circle)
      const theta = Math.random() * Math.PI * 2

      // random point INSIDE the tube cross-section (small circle)
      // use polar coordinates inside a circle for uniformity
      const r = Math.sqrt(Math.random()) * tubeRadius
      const phi = Math.random() * Math.PI * 2

      // calculation of coordinates
      // x and y form a circle of intersection, which we then distribute along the circle theta
      // important: in mesh, scale is on the last axis [1, 1, yScale],

      const x = (toTubeCenterRadius + r * Math.cos(phi)) * Math.cos(theta)
      const y = (toTubeCenterRadius + r * Math.cos(phi)) * Math.sin(theta)
      // flatten Z just like you flattened the mesh
      const z = r * Math.sin(phi) * yScale

      const pos = new Vector3(x, y, z)
      temp.push({t, factor, speed, pos})
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new Object3D(), [])

  useFrame(() => {
    particles.forEach((particle, i) => {
      const {factor, speed, pos} = particle
      // update t directly in the object
      particle.t += speed / 2

      const a = Math.cos(particle.t) + Math.sin(particle.t) / 10
      const b = Math.sin(particle.t) + Math.cos(particle.t * 2) / 10
      const s = Math.cos(particle.t)

      dummy.position.set(
        pos.x + a * factor * 0.01,
        pos.y + b * factor * 0.01,
        pos.z + a * factor * 0.01
      )
      dummy.scale.set(s * 0.1, s * 0.1, s * 0.1)
      dummy.updateMatrix()
      meshRef.current?.setMatrixAt(i, dummy.matrix)
    })

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group position={[0, 0, -5]}>
      {/* change visible parameter to see the torus */}
      <mesh scale={[1, 1, yScale]} visible={false}>
        <torusGeometry args={[toTubeCenterRadius, tubeRadius, 16, 64]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        {/* small spheres like plankton particles */}
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </instancedMesh>
    </group>
  )
}
