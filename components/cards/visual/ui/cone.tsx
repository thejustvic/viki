import {Cone} from '@react-three/drei'
import {useMemo} from 'react'
import {Checkbox} from '../../card-checklist/types'
import {BaseSphere} from './base-sphere'

type Position = [number, number, number]

const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * helper function to calculate distance between two 3d points
 */
const distanceBetweenPoints = (p1: Position, p2: Position): number => {
  const dx = p1[0] - p2[0]
  const dy = p1[1] - p2[1]
  const dz = p1[2] - p2[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * generates random points on the cone's surface using rejection sampling to prevent overlap.
 */
const generateNonOverlappingPoints = ({
  numberOfSpheres: count,
  coneRadius,
  coneHeight,
  minRequiredDistance: minDistance
}: {
  numberOfSpheres: number
  coneRadius: number
  coneHeight: number
  minRequiredDistance: number // minimum center-to-center distance required
}): Position[] => {
  const points: Position[] = []
  const maxAttemptsPerPoint = 100 // prevent infinite loops if cone is full
  let attempts = 0

  while (points.length < count && attempts < count * maxAttemptsPerPoint) {
    attempts++

    // 1. generate a candidate random point
    const h_frac = Math.random()
    const theta = randomRange(0, Math.PI * 2)
    const sphereY = -coneHeight / 2 + h_frac * coneHeight
    const currentRadius = coneRadius * (1 - h_frac)
    const sphereX = currentRadius * Math.cos(theta)
    const sphereZ = currentRadius * Math.sin(theta)
    const candidatePoint: Position = [sphereX, sphereY, sphereZ]

    // 2. check for overlap with existing points
    let isOverlapping = false
    for (const existingPoint of points) {
      if (distanceBetweenPoints(candidatePoint, existingPoint) < minDistance) {
        isOverlapping = true
        break // overlap found, reject this point
      }
    }

    // 3. if no overlap, accept the point
    if (!isOverlapping) {
      points.push(candidatePoint)
      attempts = 0 // reset attempts counter for the *next* point
    }
  }

  // log in dev only
  if (process.env.NODE_ENV !== 'production') {
    if (points.length < count) {
      // eslint-disable-next-line no-console
      console.warn(
        `could only place ${points.length} spheres without overlap after maximum attempts.`
      )
    }
  }

  return points
}

export const ConeWithSpheres = ({checklist}: {checklist?: Checkbox[]}) => {
  // define core dimensions for calculations
  const coneHeight = 6.4
  const coneRadius = 2
  const sphereRadius = 0.2

  const numberOfSpheres = checklist?.length ?? 0

  // the minimum distance between centers must be at least twice the sphere radius
  const minRequiredDistance = sphereRadius * 2.1

  const spherePositions: Position[] = useMemo(() => {
    return generateNonOverlappingPoints({
      numberOfSpheres,
      coneRadius,
      coneHeight,
      minRequiredDistance
    })
  }, [numberOfSpheres, coneRadius, coneHeight, minRequiredDistance])

  // define the position for the whole group in the scene
  const groupScenePosition: Position = [0.3, 4.2, -9.8]

  return (
    // group everything together to move the assembly easily
    <group position={groupScenePosition}>
      {/* the cone is at relative to the parent group */}
      {/* 'as const' is used on args to satisfy TS tuple requirements */}
      <Cone args={[coneRadius, coneHeight, 32] as const}>
        {/* change opacity to see the cone*/}
        <meshStandardMaterial color="hotpink" transparent opacity={0} />
      </Cone>

      {/* map over the array of random positions to render multiple spheres */}
      {spherePositions.map((position, index) => {
        const isCompleted = checklist?.[index]?.is_completed
        return (
          <BaseSphere
            key={index}
            position={position}
            text={isCompleted ? 'Completed' : 'Incomplete'}
            sphereColor={isCompleted ? 'green' : 'red'}
            textColor={isCompleted ? 'white' : 'black'}
          />
        )
      })}
    </group>
  )
}
