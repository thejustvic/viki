/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {useGLTF} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {useEffect, useMemo, useRef, useState} from 'react'
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
import {
  generateNonOverlappingPoints,
  Point,
  type PositionType
} from '../ui/tulip'

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

const calcTreePositions = (newData: Point[]) => {
  const positions: PositionType[] = []

  newData.forEach(point => {
    positions.push([point.x, 0, point.z])
  })
  return positions
}

export const TreeLindenInstances = () => {
  const {nodes, materials} = useGLTF(
    '/tree_linden.glb'
  ) as unknown as GLTFResult

  const [positions, setPositions] = useState<PositionType[]>()

  useEffect(() => {
    const newData = generateNonOverlappingPoints({
      numberOfItems: 20,
      fieldRadius: 40,
      minRequiredDistance: 5
    })
    setPositions(calcTreePositions(newData))
  }, [])

  const leafData = useMemo(() => {
    return {
      geometry: nodes.Plane001_Material001_0.geometry,
      material: materials['Material.001']
    }
  }, [nodes, materials])

  return (
    <>
      {positions?.map((position, index) => {
        return (
          <TreeLindenModel
            key={index}
            position={position}
            materials={materials}
            leafData={leafData} // data for service mesh
            gltfNodes={nodes} // original GLTFResult
          />
        )
      })}
    </>
  )
}

interface TreeProps {
  position: [number, number, number]
  materials: any
  leafData: {geometry: BufferGeometry; material: Material}
  gltfNodes: any // Raw data for reading coordinates from Blender
}

export const TreeLindenModel = ({
  position,
  materials,
  leafData,
  gltfNodes
}: TreeProps) => {
  const leavesRef = useRef<InstancedMesh>(null)

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
        delay: 5, // Delay before dropping (5 sec)
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

  useEffect(() => {
    if (!leavesRef.current) {
      return
    }

    branchKeys.forEach((key, index) => {
      const originalMesh = gltfNodes[key]
      if (originalMesh) {
        // Constructing a matrix based on position, rotation, and scale from Blender.
        tempMatrix.compose(
          originalMesh.position,
          originalMesh.quaternion,
          originalMesh.scale
        )
        // write the matrix for a specific branch based on its index (0–799).
        leavesRef.current!.setMatrixAt(index, tempMatrix)
      }
    })

    // inform Three.js that the matrix has been updated.
    leavesRef.current.instanceMatrix.needsUpdate = true
  }, [branchKeys, gltfNodes])

  // Fall animation cycle (60 fps)
  useFrame((state, delta) => {
    if (!leavesRef.current) {
      return
    }

    const elapsedTime = state.clock.getElapsedTime()
    let hasUpdates = false

    branchKeys.forEach((_, index) => {
      const data = physicsData[index]

      // check whether it is time for this small branch to fall.
      if (!data.isFalling && elapsedTime > data.delay) {
        data.isFalling = true
      }

      if (data.isFalling) {
        // Read the current instance matrix.
        leavesRef.current!.getMatrixAt(index, tempMatrix)
        tempMatrix.decompose(tempPosition, tempRotation, tempScale)

        // Absolute ground is, for example, elevation 0 on your map.
        // Since the leaf instance lies inside <group position={position}>,
        // For it, the zero level of the scene will be equal to the negative of the tree's height (the negative Y-coordinate of the tree).
        const absoluteGroundY = -position[1] - ABSOLUTE_GROUND_Y // [1] — This is the Y-coordinate of your tree on the map.

        if (tempPosition.y > absoluteGroundY) {
          // GRAVITY (downward movement along the Y-axis)
          data.yVelocity += 9.8 * delta * 0.5 // 0.5 — deceleration coefficient for air
          tempPosition.y -= data.yVelocity * delta

          // Lateral movement (movement along the X and Z axes)
          tempPosition.x += data.xVelocity * delta
          tempPosition.z += data.zVelocity * delta

          // Air resistance: reduce the horizontal speed of each frame by a couple of percent.
          // Thanks to this, the leaves will travel X meters and begin to fall almost vertically.
          data.xVelocity *= Math.pow(AIR_RESISTANCE, delta * 60)
          data.zVelocity *= Math.pow(AIR_RESISTANCE, delta * 60)

          // Wind-swaying effect (sine wave + rotation)
          tempPosition.x += Math.sin(elapsedTime * 5 + index) * delta * 0.5

          // twirl the twig in the air.
          const deltaRotation = new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0).normalize(),
            data.rotVelocity * delta
          )
          tempRotation.multiply(deltaRotation)

          // Smooth turn towards the ground [-Math.PI / 2, 0, 0]
          // Creating a swaying effect using a sine wave.
          const wobbleAngle = Math.sin(elapsedTime * 10 + index) * 0.2
          const currentTarget = targetRotation.clone()

          // add a slight oscillation in the air to the target angle.
          currentTarget.multiply(
            new Quaternion().setFromEuler(new Euler(0, wobbleAngle, 0))
          )

          // Smoothly interpolate (slerp) the current rotation towards the target rotation.
          // pass the interpolation speed (for example, delta * 2, where 2 is the alignment speed).
          tempRotation.slerp(currentTarget, delta * 2)

          hasUpdates = true
        } else {
          // If it has fallen to the ground, we stop its movement at the specific point of impact.
          tempPosition.y = absoluteGroundY
          data.xVelocity = 0
          data.zVelocity = 0

          // Upon contact with the ground, we lock it in a perfectly level position
          tempRotation.copy(targetRotation)
        }

        // write the modified coordinates back into the matrix.
        tempMatrix.compose(tempPosition, tempRotation, tempScale)
        leavesRef.current!.setMatrixAt(index, tempMatrix)
      }
    })

    // update the matrix in WebGL only if something has moved.
    if (hasUpdates) {
      leavesRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group dispose={null}>
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
      </group>
    </group>
  )
}
