/* eslint-disable max-lines-per-function */
import {useFrame} from '@react-three/fiber'
import {useMemo, useRef} from 'react'
import {Group, Vector3} from 'three'
import {JellyfishModel} from '../components/jellyfish-model'
import {
  torusToTubeCenterRadius,
  torusTubeRadius,
  torusYScale
} from './ocean-plankton'

export const JellyfishTorus = () => {
  const swimmers = useMemo(() => {
    const result: {
      initialTheta: number
      phi: number
      r: number
      actualPos: Vector3
    }[] = []
    const count = 10
    const minDistance = 2 // minimum distance between jellyfish (select according to model size)

    const clusterCenterTheta = Math.PI
    const clusterCenterPhi = Math.PI

    for (let i = 0; i < count; i++) {
      let positionFound = false
      let attempts = 0

      while (!positionFound && attempts < 100) {
        // generate potential coordinates within the flock

        // For them to be close together within a radius of 300, the randomness must be microscopic
        const theta = clusterCenterTheta + (Math.random() - 0.5) * 0.1 // this is the length of the "jam" along the track
        // angle inside the pipe
        const phi = clusterCenterPhi + (Math.random() - 0.5) * 0.2 //  this is the width of the group inside the pipe
        // r must be significant (e.g. half the radius of the pipe),
        // otherwise they are all at one point in the center
        const r = torusTubeRadius * 0.5 + (Math.random() - 0.5) * 20 // this is the depth (distance from the center of the pipe to the wall)

        // calculate the real X, Y, Z position to check the distance
        const x =
          (torusToTubeCenterRadius + r * Math.cos(phi)) * Math.cos(theta)
        const y =
          (torusToTubeCenterRadius + r * Math.cos(phi)) * Math.sin(theta)
        const z = r * Math.sin(phi) * torusYScale
        const newPos = new Vector3(x, y, z)

        // check the distance to all already created jellyfish
        const isTooClose = result.some(
          p => p.actualPos.distanceTo(newPos) < minDistance
        )

        if (!isTooClose) {
          result.push({initialTheta: theta, phi, r, actualPos: newPos})
          positionFound = true
        }
        attempts++
      }
    }
    return result
  }, [torusTubeRadius, torusToTubeCenterRadius])

  return (
    <group position={[0, 0, -5]}>
      {/* Visual Torus Guide */}
      <mesh scale={[1, 1, torusYScale]} visible={false}>
        <torusGeometry
          args={[torusToTubeCenterRadius, torusTubeRadius, 16, 64]}
        />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* The 10 Jellyfish */}
      {swimmers.map((props, i) => (
        <JellyfishSwimmer key={i} {...props} />
      ))}
    </group>
  )
}
const JellyfishSwimmer = ({
  initialTheta,
  r,
  phi
}: {
  initialTheta: number
  r: number
  phi: number
}) => {
  const outerGroupRef = useRef<Group>(null) // direction container
  const thetaRef = useRef(initialTheta)

  // create individual characteristics once when creating a jellyfish
  const config = useMemo(
    () => ({
      speed: 0.001,
      offset: Math.random() * Math.PI * 2, // timeshift for animation
      scale: 0.01 + Math.random() * 0.01 // [0.01 ... 0.02]
    }),
    []
  )

  useFrame((_state, delta) => {
    thetaRef.current += delta * config.speed

    // position (torus math)
    const x =
      (torusToTubeCenterRadius + r * Math.cos(phi)) * Math.cos(thetaRef.current)
    const y =
      (torusToTubeCenterRadius + r * Math.cos(phi)) * Math.sin(thetaRef.current)
    const z = r * Math.sin(phi) * torusYScale

    if (outerGroupRef.current) {
      outerGroupRef.current.position.set(x, y, z)

      // direction along a great circle
      const forwardAngle = thetaRef.current + Math.PI / 2

      // set the orientation that takes into account the PIPE inclination (phi)
      // using rotation.set to reset previous values
      outerGroupRef.current.rotation.set(0, 0, forwardAngle)

      // add a slope phi so that the jellyfish is always parallel to the wall inside
      // this aligns the local axis of the jellyfish with the slope of the pipe.
      outerGroupRef.current.rotateY(-phi)

      // raise jellyfish head and turn right locally
      outerGroupRef.current.rotateZ(Math.PI / 2) // right turn/U-turn
      outerGroupRef.current.rotateX(-0.8) // raise jellyfish head
    }
  })

  return (
    <group ref={outerGroupRef}>
      {/* pass the offset to the model so that they do not pulse simultaneously */}
      <JellyfishModel offset={config.offset} scale={config.scale} />
    </group>
  )
}
