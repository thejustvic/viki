/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import tw from '@/components/common/tw-styled-components'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Html, useGLTF} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {observer} from 'mobx-react-lite'
import {Suspense, useEffect, useMemo, useRef, useState} from 'react'
import {
  BufferGeometry,
  Euler,
  InstancedMesh,
  Material,
  Matrix4,
  Quaternion,
  Vector3,
  type Mesh,
  type MeshStandardMaterial
} from 'three'
import type {GLTF} from 'three-stdlib'
import {useCardChecklistStore} from '../../card-checklist/card-checklist-store'
import {useCardInfoStore} from '../../card-info/card-info-store'
import {getSearchCard} from '../../get-search-card'
import {Card} from '../../types'
import {Point, useMainSequence, type PositionType} from '../ui/tulip'
import {TextWithBg} from './tulip-instances'

type GLTFResult = GLTF & {
  nodes: {
    tree001_Material_0: Mesh
    // Dynamic template for all 800 planes
    [key: `Plane${string}_Material001_0`]: Mesh
  }
  materials: {
    Material: MeshStandardMaterial
    ['Material.001']: MeshStandardMaterial
  }
}

const calcPositions = (newData: Point[]) => {
  const positions: PositionType[] = []

  newData.forEach(point => {
    positions.push([point.x, 0, point.z])
  })
  return positions
}

interface CardDataProps {
  card: Card | null
  checklist: Checkbox[] | undefined
}

const getBaseConstants = (checklist: Checkbox[] | undefined) => {
  const baseRadius = 10
  const referenceCount = 2
  const scaleFactor = Math.sqrt(
    Math.max(referenceCount, checklist?.length ?? 0) / referenceCount
  )
  const fieldRadius = baseRadius * scaleFactor

  const itemRadius = 5
  const minRequiredDistance = itemRadius * 2

  return {
    baseRadius,
    referenceCount,
    scaleFactor,
    fieldRadius,
    minRequiredDistance
  }
}

export const Trees = observer(() => {
  const id = String(getSearchCard())

  const [, cardChecklistStore] = useCardChecklistStore()
  const [cardInfoState] = useCardInfoStore()

  const checklist = cardChecklistStore.getAllCheckboxes(id)
  const card = cardInfoState.card.data

  const {fieldRadius, minRequiredDistance} = getBaseConstants(checklist)

  const [positions, updatePositions] = useState<PositionType[]>([])
  const [shouldShrink, updateShouldShrink] = useState(false)
  const [cardData, updateCardData] = useState<CardDataProps>({
    card: card,
    checklist: checklist
  })

  useMainSequence({
    updatePositions,
    updateShouldShrink,
    updateCardData,
    calcPositions,
    checklist,
    cardData,
    card,
    minRequiredDistance,
    fieldRadius
  })

  return (
    <group>
      <Suspense fallback={<LoadingTrees />}>
        <TreeLindenInstances
          checklist={cardData.checklist}
          positions={positions}
          card={cardData.card}
          shouldShrink={shouldShrink}
        />
      </Suspense>
    </group>
  )
})

const TwWrapper = tw.div`
  text-2xl
  text-white
  bold
  -ml-14
  pb-10
  truncate
`

const LoadingTrees = () => {
  return (
    <Html>
      <TwWrapper>loading of trees...</TwWrapper>
    </Html>
  )
}

interface TreeLindenInstancesProps {
  positions: PositionType[]
  card: Card | null
  checklist: Checkbox[] | undefined
  shouldShrink: boolean
}

export const TreeLindenInstances = observer(
  ({positions, checklist}: TreeLindenInstancesProps) => {
    const {nodes, materials} = useGLTF(
      '/tree_linden.glb'
    ) as unknown as GLTFResult

    const leafData = useMemo(() => {
      return {
        geometry: nodes.Plane001_Material001_0.geometry,
        material: materials['Material.001']
      }
    }, [nodes, materials])

    return (
      <>
        {positions?.map((position, index) => {
          const checkbox = checklist?.[index]
          const isCompleted = Boolean(checkbox?.is_completed)
          const text = checkbox?.title ?? ''
          return (
            <TreeLindenModel
              key={index}
              position={position}
              materials={materials}
              leafData={leafData} // data for service mesh
              gltfNodes={nodes} // original GLTFResult
              checkbox={checkbox}
              isCompleted={isCompleted}
              text={text}
            />
          )
        })}
      </>
    )
  }
)

interface TreeProps {
  position: [number, number, number]
  materials: any
  leafData: {geometry: BufferGeometry; material: Material}
  gltfNodes: any // Raw data for reading coordinates from Blender
  checkbox: Checkbox | undefined
  isCompleted: boolean
  text: string
}

export const TreeLindenModel = observer(
  ({
    position,
    materials,
    leafData,
    gltfNodes,
    checkbox,
    isCompleted,
    text
  }: TreeProps) => {
    const [globalState] = useGlobalStore()
    const {updateCheckboxIsCompleted} = useCheckboxHandlers()

    const leavesRef = useRef<InstancedMesh>(null)

    // A ref for recording the exact time when isCompleted became true.
    const fallStartTimeRef = useRef<number | null>(null)

    // A single ref to control the tree's sleep state (true = leaves fly, false = tree sleeps)
    const isAnimatingRef = useRef<boolean>(false)

    // collecting the keys for all 800 planes.
    const branchKeys = useMemo(() => {
      return Object.keys(gltfNodes).filter(key => key.startsWith('Plane'))
    }, [gltfNodes])

    {
      /**
    • If you want a spread within a 1–2 meter radius, set MAX_DISTANCE_FORCE = 3 and AIR_RESISTANCE = 0.92.
    • If you want a spread with a radius of 5–8 meters, set MAX_DISTANCE_FORCE = 10 and AIR_RESISTANCE = 0.98.
    */
    }
    // --- SPREAD RANGE ADJUSTMENT ---
    const MIN_DISTANCE_FORCE = 5 // Minimum range (initial velocity)
    const MAX_DISTANCE_FORCE = 20 // Maximum range (initial velocity)
    const AIR_RESISTANCE = 0.98 // Air resistance (0.90 — will fall under the tree, 0.99 — will fly very far)
    const TARGET_ROTATION = 0.3
    const ABSOLUTE_GROUND_Y = 0.1
    const RETURN_SPEED = 3 // the speed of leaves returning from the ground to the tree

    // create an array of physical data for each branch.
    const physicsData = useMemo(() => {
      return branchKeys.map(() => {
        // create a random dispersion angle (360 degrees).
        const angle = Math.random() * Math.PI * 2
        // force of the initial push sideways
        const force =
          MIN_DISTANCE_FORCE +
          Math.random() * (MAX_DISTANCE_FORCE - MIN_DISTANCE_FORCE)

        return {
          yVelocity: 0, // Initial vertical velocity
          xVelocity: Math.cos(angle) * force, // X-axis propagation speed
          zVelocity: Math.sin(angle) * force, // Z-expansion velocity
          rotVelocity: (Math.random() - 0.5) * 5, // Airborne rotation speed (faster)
          delay: 0, // Delay before dropping (0 sec)
          isFalling: false // Fall status
        }
      })
    }, [branchKeys])

    // Auxiliary objects (to avoid creating new ones in useFrame)
    const tempMatrix = useMemo(() => new Matrix4(), [])
    const tempPosition = useMemo(() => new Vector3(), [])
    const tempRotation = useMemo(() => new Quaternion(), [])
    const tempScale = useMemo(() => new Vector3(), [])

    const targetRotation = useMemo(() => {
      return new Quaternion().setFromEuler(
        new Euler(0, 0, Math.PI / 2 - TARGET_ROTATION)
      )
    }, [])

    // Initialization of positions
    useEffect(() => {
      if (!leavesRef.current) {
        return
      }

      const localGroundY = -position[1] - ABSOLUTE_GROUND_Y

      branchKeys.forEach((key, index) => {
        const originalMesh = gltfNodes[key]
        if (originalMesh) {
          // If the checkbox is ALREADY selected upon loading, we immediately drop the leaves to the floor.
          if (isCompleted) {
            const data = physicsData[index]

            // 1. Copy the starting coordinates from Blender for the simulation.
            const simPos = originalMesh.position.clone()
            const simRot = originalMesh.quaternion.clone()

            // Temporary local copies of velocities, to avoid corrupting the original physicsData
            let simXVel = data.xVelocity
            let simZVel = data.zVelocity
            let simYVel = 0

            // Simulation time step (simulating a stable 60 FPS)
            const simDelta = 1 / 60

            // Set the time for calculating the swaying sine wave (starting point)
            let simTime = 0

            // 2. simulate the flight step by step until the leaf falls below ground level.
            while (simPos.y > localGroundY) {
              simTime += simDelta

              // Downward and sideways movement (an exact replica of useFrame physics)
              simYVel += 9.8 * simDelta * 0.5
              simPos.y -= simYVel * simDelta
              simPos.x += simXVel * simDelta
              simPos.z += simZVel * simDelta

              // Air resistance
              simXVel *= Math.pow(AIR_RESISTANCE, simDelta * 60)
              simZVel *= Math.pow(AIR_RESISTANCE, simDelta * 60)

              // Rocking and smooth angle leveling
              const wobbleAngle = Math.sin(simTime * 10 + index) * 0.2
              const currentTarget = targetRotation.clone()
              currentTarget.multiply(
                new Quaternion().setFromEuler(new Euler(0, wobbleAngle, 0))
              )
              simRot.slerp(currentTarget, simDelta * 2)
            }

            // 3. Once the sheet reaches the ground, secure it firmly to the floor and apply the final angle.
            tempPosition.set(simPos.x, localGroundY, simPos.z)
            tempRotation.copy(targetRotation) // Or simRot, if you want to keep a slight element of randomness regarding the landing angle.
          } else {
            // If it hasn't been done, we distribute them onto the branches within the crown, as usual.
            tempPosition.copy(originalMesh.position)
            tempRotation.copy(originalMesh.quaternion)
          }

          // Constructing a matrix based on position, rotation, and scale from Blender.
          tempMatrix.compose(tempPosition, tempRotation, originalMesh.scale)
          // write the matrix for a specific branch based on its index (0–799).
          leavesRef.current!.setMatrixAt(index, tempMatrix)
        }
      })

      // If the scene started with the checkbox already checked, we fix the timer,
      // so that `useFrame` knows it shouldn't animate the fall — it's already on the ground
      if (isCompleted) {
        fallStartTimeRef.current = 0 // mark the start, so as to skip the explosion.
      }

      // inform Three.js that the matrix has been updated.
      leavesRef.current.instanceMatrix.needsUpdate = true
    }, [branchKeys, gltfNodes])

    useFrame((state, delta) => {
      if (!leavesRef.current) {
        return
      }

      const elapsedTime = state.clock.getElapsedTime()
      let hasUpdates = false

      // THE MAGIC OF OPTIMIZATION FOR THE FOREST:
      // If the tree loaded in an already completed state (fallStartTime === 0), it remains motionless.
      if (isCompleted && fallStartTimeRef.current === 0) {
        return
      }

      // THE MAGIC OF OPTIMIZATION FOR THE GREEN FOREST:
      // If the task is NOT completed, the fall timer is reset, and the tree has finished reassembling —
      // put it completely to sleep
      if (
        !isCompleted &&
        fallStartTimeRef.current === null &&
        !isAnimatingRef.current
      ) {
        return
      }

      let activeBranchesCount = 0 // count how many branches are still in the air right now.
      const absoluteGroundY = -position[1] - ABSOLUTE_GROUND_Y // [1] — This is the Y-coordinate of your tree on the map.

      branchKeys.forEach((key, index) => {
        const data = physicsData[index]
        const originalMesh = gltfNodes[key]
        if (!originalMesh) {
          return
        }

        if (isCompleted) {
          // ==========================================
          // FALL MODE (isCompleted === true)
          // ==========================================
          if (fallStartTimeRef.current === null) {
            fallStartTimeRef.current = elapsedTime
            isAnimatingRef.current = true // Waking up the tree for movement

            // reset the scattering momentum for each branch before it falls!
            // When the outer loop is just beginning
            // and the processor processes the very first branch (index === 0), the gateway opens.
            // The inner loop is run only once,
            // instantly "charging" new random velocities
            // for all 800 branches of this tree simultaneously.
            if (index === 0) {
              branchKeys.forEach((_, index) => {
                const data = physicsData[index]
                const angle = Math.random() * Math.PI * 2
                const force =
                  MIN_DISTANCE_FORCE +
                  Math.random() * (MAX_DISTANCE_FORCE - MIN_DISTANCE_FORCE)

                data.xVelocity = Math.cos(angle) * force // Reset the X-axis speed to a new random value.
                data.zVelocity = Math.sin(angle) * force // Reset the Z-axis speed to a new random value.
                data.yVelocity = 0 // Reducing vertical speed
              })
            }
          }
          const timeSinceTrigger = elapsedTime - fallStartTimeRef.current

          if (!data.isFalling && timeSinceTrigger > data.delay) {
            data.isFalling = true
          }

          if (data.isFalling) {
            // read the current matrix of a specific leaf.
            leavesRef.current!.getMatrixAt(index, tempMatrix)
            tempMatrix.decompose(tempPosition, tempRotation, tempScale)

            if (tempPosition.y > absoluteGroundY) {
              // Downward and sideways movement
              data.yVelocity += 9.8 * delta * 0.5 // 0.5 — deceleration coefficient for air
              tempPosition.y -= data.yVelocity * delta
              tempPosition.x += data.xVelocity * delta
              tempPosition.z += data.zVelocity * delta

              // Air resistance
              data.xVelocity *= Math.pow(AIR_RESISTANCE, delta * 60)
              data.zVelocity *= Math.pow(AIR_RESISTANCE, delta * 60)

              // Swaying and smooth leveling toward the ground
              const wobbleAngle = Math.sin(elapsedTime * 10 + index) * 0.2
              const currentTarget = targetRotation.clone()
              currentTarget.multiply(
                new Quaternion().setFromEuler(new Euler(0, wobbleAngle, 0))
              )
              tempRotation.slerp(currentTarget, delta * 2)

              // write the updated coordinates back into the instance matrix.
              tempMatrix.compose(tempPosition, tempRotation, tempScale)
              leavesRef.current!.setMatrixAt(index, tempMatrix)

              hasUpdates = true
              activeBranchesCount++ // This branch is still flying toward the ground.
            } else if (tempPosition.y !== absoluteGroundY) {
              // Securing to the ground flat against the surface
              tempPosition.y = absoluteGroundY
              data.xVelocity = 0
              data.zVelocity = 0
              tempRotation.copy(targetRotation)

              // write the updated coordinates back into the instance matrix.
              tempMatrix.compose(tempPosition, tempRotation, tempScale)
              leavesRef.current!.setMatrixAt(index, tempMatrix)

              hasUpdates = true
            }
          }
        } else {
          // ==========================================
          // COLLECTION MODE (isCompleted === false)
          // ==========================================
          if (fallStartTimeRef.current !== null) {
            fallStartTimeRef.current = null // Reset to null so the tree comes back to life for future clicks.
            isAnimatingRef.current = true // Waking up the tree for the flight back
          }
          data.isFalling = false
          data.yVelocity = 0

          leavesRef.current!.getMatrixAt(index, tempMatrix)
          tempMatrix.decompose(tempPosition, tempRotation, tempScale)

          const distanceToOriginal = tempPosition.distanceTo(
            originalMesh.position
          )
          const angleToOriginal = tempRotation.angleTo(originalMesh.quaternion)

          // If the leaf is still lying on the ground or flying through the air, gently pull it onto the branch.
          if (distanceToOriginal > 0.001 || angleToOriginal > 0.001) {
            tempPosition.lerp(originalMesh.position, delta * RETURN_SPEED)
            tempRotation.slerp(originalMesh.quaternion, delta * RETURN_SPEED)

            // write the updated coordinates back into the instance matrix.
            tempMatrix.compose(tempPosition, tempRotation, tempScale)
            leavesRef.current!.setMatrixAt(index, tempMatrix)

            hasUpdates = true
            activeBranchesCount++ // This branch still turns back into the crown.
          } else if (tempPosition.x !== originalMesh.position.x) {
            // Perfect fixation at a specific point with Blender
            tempPosition.copy(originalMesh.position)
            tempRotation.copy(originalMesh.quaternion)

            // write the updated coordinates back into the instance matrix.
            tempMatrix.compose(tempPosition, tempRotation, tempScale)
            leavesRef.current!.setMatrixAt(index, tempMatrix)

            hasUpdates = true
          }
        }
      })

      // If all 800 branches have finished moving (landed or returned), put the tree into a sleep state.
      if (activeBranchesCount === 0) {
        isAnimatingRef.current = false
      }

      // update the image in WebGL only if movement has occurred.
      if (hasUpdates) {
        leavesRef.current.instanceMatrix.needsUpdate = true
      }
    })

    return (
      <group
        dispose={null}
        onClick={event => {
          if (globalState.is3DSceneLocked) {
            return
          }
          // prevent click from bleeding through to objects behind
          event.stopPropagation()
          if (checkbox) {
            updateCheckboxIsCompleted(!checkbox.is_completed, checkbox.id)
          }
        }}
      >
        {/* Main tree group on the map */}
        <group position={position}>
          {/* render the trunk as a standard mesh */}
          <mesh
            geometry={gltfNodes.tree001_Material_0.geometry}
            material={materials.Material}
            rotation={[-Math.PI / 2, 0, -1.109]}
            castShadow
            receiveShadow
          />

          {/*
          CLEAN INSTANCED MESH WITH 800 OBJECTS:
          It uses up just 1 draw call for the entire tree and runs super fast!
        */}
          <instancedMesh
            ref={leavesRef}
            args={[leafData.geometry, leafData.material, branchKeys.length]} // [geometry, material, 800]
            castShadow
            receiveShadow
            frustumCulled={false}
            material-color="#fcac65"
          />
          <TextWithBg
            text={text}
            plateTextColor={'#3E2723'}
            plateBgColor={'grey'}
            tree
          />
        </group>
      </group>
    )
  }
)
