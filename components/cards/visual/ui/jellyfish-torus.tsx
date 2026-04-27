/* eslint-disable max-lines-per-function */
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useFrame} from '@react-three/fiber'
import {observer} from 'mobx-react-lite'
import {useMemo, useRef} from 'react'
import {Group, Vector3} from 'three'
import {useCardChecklistStore} from '../../card-checklist/card-checklist-store'
import {useCardInfoStore} from '../../card-info/card-info-store'
import {getSearchCard} from '../../get-search-card'
import {Card} from '../../types'
import {JellyfishModel} from '../components/jellyfish-model'
import {
  torusToTubeCenterRadius,
  torusTubeRadius,
  torusYScale
} from './ocean-plankton'

interface ISwimmer {
  initialTheta: number
  phi: number
  r: number
  actualPos: Vector3
  checkbox: Checkbox
  card: Card
}

export const JellyfishTorus = observer(() => {
  const id = String(getSearchCard())
  const [, cardChecklistStore] = useCardChecklistStore()
  const [cardInfoState] = useCardInfoStore()

  const checklist = cardChecklistStore.getAllCheckboxes(id)
  const card = cardInfoState.card.data

  const swimmers = useMemo(() => {
    const result: ISwimmer[] = []
    const count = checklist?.length ?? 0
    if (count === 0) {
      return result
    }

    // cluster parameters

    // clusterCenterTheta = 0                  left side
    // clusterCenterTheta = Math.PI            right side
    // clusterCenterTheta = Math.PI / 2        forward side
    // clusterCenterTheta = 3 * Math.PI / 2    backward side
    const clusterCenterTheta = (3 * Math.PI) / 2
    const clusterCenterPhi = Math.PI

    // golden angle (~137.5 degrees) for even filling
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < count; i++) {
      const checkbox = checklist?.[i]
      if (!checkbox || !card) {
        return
      }
      // Fibonacci algorithm for distribution inside a circle (pipe cross-section)
      // t — normalized index (from 0 to 1)
      const t = i / count
      const r_offset = Math.sqrt(t) * (torusTubeRadius * 0.6) // distribution from the center to the edges of the pipe
      const phi_angle = i * GOLDEN_ANGLE // each subsequent jellyfish returns to the golden angle

      // add a small deviation along the trajectory (Theta) so that they are not in the same plane
      // use i * 0.015 for linear displacement along the pipe
      const theta = clusterCenterTheta + (i - count / 2) * 0.015

      // coordinates inside the pipe (Phi)
      // phi_angle defines the position in the circle of the section
      const phi =
        clusterCenterPhi + Math.sin(phi_angle) * (r_offset / torusTubeRadius)
      const r = r_offset

      // calculating the final position for initialization
      const x = (torusToTubeCenterRadius + r * Math.cos(phi)) * Math.cos(theta)
      const y = (torusToTubeCenterRadius + r * Math.cos(phi)) * Math.sin(theta)
      const z = r * Math.sin(phi) * torusYScale
      const actualPos = new Vector3(x, y, z)

      result.push({
        initialTheta: theta,
        phi,
        r,
        actualPos,
        checkbox,
        card
      })
    }
    return result
  }, [checklist, card, torusTubeRadius, torusToTubeCenterRadius])

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

      {/* The Checkboxes Jellyfish */}
      {swimmers?.map(props => (
        <JellyfishSwimmer key={props.checkbox.id} {...props} />
      ))}
    </group>
  )
})

const JellyfishSwimmer = observer(
  ({initialTheta, r, phi, card, checkbox}: ISwimmer) => {
    const [globalState] = useGlobalStore()
    const {updateCheckboxIsCompleted} = useCheckboxHandlers()

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
        (torusToTubeCenterRadius + r * Math.cos(phi)) *
        Math.cos(thetaRef.current)
      const y =
        (torusToTubeCenterRadius + r * Math.cos(phi)) *
        Math.sin(thetaRef.current)
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
        outerGroupRef.current.rotateX(-1.3) // raise jellyfish head
      }
    })

    return (
      <group
        ref={outerGroupRef}
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
        {/* pass the offset to the model so that they do not pulse simultaneously */}
        <JellyfishModel
          offset={config.offset}
          scale={config.scale}
          text={checkbox.title}
          color={
            checkbox?.is_completed
              ? (card?.jellyfish_color_completed ?? '')
              : (card?.jellyfish_color_not_completed ?? '')
          }
        />
      </group>
    )
  }
)
