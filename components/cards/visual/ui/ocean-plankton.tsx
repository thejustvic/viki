import {useFrame} from '@react-three/fiber'
import {useMemo, useRef} from 'react'
import {AdditiveBlending, InstancedMesh, Object3D, Vector3} from 'three'

interface PlanktonProps {
  count?: number
  area?: [number, number, number] // [width, height, depth]
}

export const OceanPlankton = ({
  count = 1000,
  area = [100, 100, 100]
}: PlanktonProps) => {
  const meshRef = useRef<InstancedMesh>(null)
  // create an array of random positions and velocities for particles
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100 // random shift for animation
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xAngle = Math.random() * Math.PI
      const yAngle = Math.random() * Math.PI
      const zAngle = Math.random() * Math.PI
      const pos = new Vector3(
        (Math.random() - 0.5) * area[0],
        (Math.random() - 0.5) * area[1],
        (Math.random() - 0.5) * area[2]
      )
      temp.push({t, factor, speed, xAngle, yAngle, zAngle, pos})
    }
    return temp
  }, [count, area])

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
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      position={[0, 20, -50]}
    >
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
  )
}
