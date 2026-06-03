/* eslint-disable max-lines-per-function */
/*
Command: npx gltfjsx@6.5.3 public/pond_turtle.glb --transform --types --resolution 1024 --keepgroups --keepmeshes
Files: public/pond_turtle.glb [6.81MB] > pond_turtle.glb [934.91KB] (86%)
*/

import {useAnimations, useGLTF} from '@react-three/drei'
import {useFrame, useGraph} from '@react-three/fiber'
import {useEffect, useMemo, useRef} from 'react'
import {
  AnimationAction,
  AnimationClip,
  Bone,
  Event,
  Group,
  MeshBasicMaterial,
  SkinnedMesh
} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'

type ActionName = 'Animation'

interface GLTFAction extends AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Object_7: SkinnedMesh
    Object_8: SkinnedMesh
    GLTF_created_0_rootJoint: Bone
  }
  materials: {
    ['Material.002']: MeshBasicMaterial
  }
  animations: GLTFAction[]
}

interface MixerLoopEvent extends Event {
  action: AnimationAction
}

export const PondTurtleModel = () => {
  const group = useRef<Group>(null)
  const {scene, animations} = useGLTF('/pond_turtle.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  const {actions, mixer} = useAnimations(animations, group)

  // dynamically determining animation duration
  const loopDuration = useRef(10.416666984558105)
  const currentLoopIndex = useRef(1)

  useEffect(() => {
    const action = actions['Animation']
    if (action) {
      const exactDuration = action.getClip().duration
      loopDuration.current = exactDuration

      action.reset().play()

      // perfectly accurate loop tracking via the 'loop' event of the Three.js mixer itself
      const handleLoop = (e: MixerLoopEvent) => {
        // check that animation clip is finished.
        if (e.action.getClip().name === 'Animation') {
          currentLoopIndex.current += 1
        }
      }

      // subscribe to the animation circle completion event
      mixer.addEventListener('loop', handleLoop)

      return () => {
        action.fadeOut(0.5)
        mixer.removeEventListener('loop', handleLoop)
      }
    }
  }, [actions, mixer])

  // motion and timing settings
  const radius = 116
  const baseSpeed = 0.007
  const movementTime = useRef(0)

  // array of pauses within a single loop (from second X to second Y)
  const pauses = [{start: 9, end: 11}]

  useFrame((_state, delta) => {
    if (!group.current) {
      return
    }

    const action = actions['Animation']
    if (!action) {
      return
    }

    // get the EXACT current animation time directly from the Three.js engine
    const currentTimeInLoop = action.time

    // checking for pause based on the OFFICIAL animation time
    const isPaused = pauses.some(
      pause => currentTimeInLoop >= pause.start && currentTimeInLoop < pause.end
    )

    // control the speed of movement in a circle.
    const currentSpeed = isPaused ? 0 : baseSpeed
    movementTime.current += delta * currentSpeed

    // leave the animation itself to play (timeScale = 1) so that the standing phase can work out.
    action.timeScale = 1

    // calculating position and rotation
    const t = movementTime.current
    group.current.position.x = Math.cos(t) * radius
    group.current.position.z = Math.sin(t) * radius
    group.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.GLTF_created_0_rootJoint} />
      <skinnedMesh
        name="Object_7"
        geometry={nodes.Object_7.geometry}
        material={materials['Material.002']}
        skeleton={nodes.Object_7.skeleton}
        scale={8.292}
      />
      <skinnedMesh
        name="Object_8"
        geometry={nodes.Object_8.geometry}
        material={materials['Material.002']}
        skeleton={nodes.Object_8.skeleton}
        scale={8.292}
      />
    </group>
  )
}
