/* eslint-disable max-lines-per-function */
import {useGLTF} from '@react-three/drei'
import {useFrame, useGraph} from '@react-three/fiber'
import {useMemo, useRef} from 'react'
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial
} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'

const JELLYFISH_RENDER_ORDER = 10 // the higher the number, the later the object is drawn (on top of others)

type GLTFResult = GLTF & {
  nodes: {
    Cylinder002_Jellyfish3_0: Mesh
    BezierCurve002_Jellyfish3_0: Mesh
  }
  materials: {
    Jellyfish3: MeshStandardMaterial
  }
}

interface JellyfishModelProps {
  offset?: number
  scale?: number
}

export const JellyfishModel = ({
  offset = 0,
  scale = 0.01
}: JellyfishModelProps) => {
  const group = useRef<Group>(null)
  const pivotRef = useRef<Group>(null)
  const {scene} = useGLTF('/jellyfish.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult

  const jellyfishMaterial = useMemo(() => {
    const m = materials.Jellyfish3.clone()

    m.emissive = new Color('#00f2ff')
    m.transparent = true
    m.blending = AdditiveBlending // the color will layer and glow
    m.side = DoubleSide // both the inner and outer walls will glow

    return m
  }, [materials])

  useFrame(state => {
    const t = state.clock.getElapsedTime() + offset

    // rotation of the entire jellyfish
    if (group.current) {
      // slow constant rotation around the Y axis
      group.current.rotation.y = t * 0.2

      // slight rocking (sideways tilts)
      group.current.rotation.x = Math.cos(t * 0.5) * 0.1
      group.current.rotation.z = Math.sin(t * 0.5) * 0.1

      // UP-DOWN swing
      // t * 1.5 — speed must match the speed of the tentacles
      // 0.5 — amplitude (how high it floats)
      group.current.position.y = Math.sin(t * 1.5) * 0.5
    }
    // tentacle animation
    if (pivotRef.current) {
      // determining the compression/stretching force
      // use Math.sin without abs to get both compression and stretching
      const wave = Math.sin(t * 1.5) * 0.2

      // vertical scaling (Y)
      // when wave is negative, the tentacles shorten.
      pivotRef.current.scale.y = 1 + wave

      // horizontal scaling (X and Z)
      // use MINUS wave:
      // if Y decreases (1 - 0.2 = 0.8), then X/Z increases (1 - (-0.2) = 1.2)
      const thickness = 1 - wave

      pivotRef.current.scale.x = thickness
      pivotRef.current.scale.z = thickness
    }

    // luminescence pulsation
    if (jellyfishMaterial) {
      jellyfishMaterial.opacity = 0.1 + Math.abs(Math.sin(t * 1.5)) * 0.1
    }
  })

  return (
    <group ref={group} dispose={null} scale={scale}>
      <mesh
        renderOrder={JELLYFISH_RENDER_ORDER}
        geometry={nodes.Cylinder002_Jellyfish3_0.geometry}
        material={jellyfishMaterial}
        position={[0, 123.354, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[62.143, 62.143, 74.045]}
      />
      <group
        ref={pivotRef}
        position={[0, 0, 0]} // point where growth begins (top of tentacles)
      >
        <mesh
          renderOrder={JELLYFISH_RENDER_ORDER}
          geometry={nodes.BezierCurve002_Jellyfish3_0.geometry}
          material={jellyfishMaterial}
          /*
            IMPORTANT: add position.y to shift the mesh down to stretch the tentacles only downwards
          */
          position={[0, -25, 0]}
          scale={[100, 119.153, 100]}
        />
      </group>
    </group>
  )
}
