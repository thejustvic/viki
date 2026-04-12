import {useFrame} from '@react-three/fiber'
import {useRef} from 'react'
import {Group, Matrix4, Vector3} from 'three'
import {DolphinModel} from '../components/dolphin-model'

export const DolphinScene = () => {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 20, 0]}>
      <Dolphin />
    </group>
  )
}
const Dolphin = () => {
  const group = useRef<Group>(null)

  // torus (closed spring) adjustment
  const mainRadius = 10 // radius of the great circle (the whole "bagel")
  const spiralRadius = 3 // the radius of the small "spring" (how much it sags)

  const mainSpeed = 0.5 // great circle speed
  const spiralFreq = 3 // how many turns of a spring are in one large circle

  const rollAmp = 1.6 // body tilt

  useFrame(state => {
    if (!group.current) {
      return
    }

    const t = state.clock.getElapsedTime()

    // get positions
    const getPos = (time: number) => {
      const angleMain = time * mainSpeed
      const angleSpiral = time * spiralFreq
      const offset = mainRadius + Math.cos(angleSpiral) * spiralRadius
      return new Vector3(
        Math.cos(angleMain) * offset,
        Math.sin(angleSpiral) * spiralRadius,
        Math.sin(angleMain) * offset
      )
    }

    const currentPos = getPos(t)
    const nextPos = getPos(t + 0.01) // very small step for accuracy

    // establishing a position
    group.current.position.copy(currentPos)

    // calculate the direction vector (forward)
    const forward = new Vector3().subVectors(nextPos, currentPos).normalize()

    // calculate the "side" vector relative to the center of the great circle
    // this will help the dolphin understand where the "inside" side of the turn is
    const centerPos = new Vector3(0, currentPos.y, 0)
    const side = new Vector3().subVectors(currentPos, centerPos).normalize()

    // calculate the "up" vector through the cross product
    const up = new Vector3().crossVectors(forward, side).normalize()

    // creating an orientation matrix
    const matrix = new Matrix4()
    matrix.makeBasis(side, up, forward) // set new axes: X=side, Y=up, Z=forward
    group.current.quaternion.setFromRotationMatrix(matrix)

    // CORRECTION (if the model is looking in the wrong direction)
    // if after this the dolphin swims sideways/backwards, add a fixed turn:
    group.current.rotateZ(Math.PI)

    // roll
    // the Z-tilt will work perfectly relative to the nose
    group.current.rotateZ(Math.sin(t * spiralFreq) * rollAmp)
  })

  return (
    <group ref={group}>
      <DolphinModel />
    </group>
  )
}
