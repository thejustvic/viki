import {Canopy} from '@/components/canopy/canopy'
import {CANOPY_CONFIG} from '@/components/canopy/canopy-config'
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useFrame} from '@react-three/fiber'
import {observer} from 'mobx-react-lite'
import {useMemo, useRef} from 'react'
import {Group} from 'three'
import {useCardChecklistStore} from '../../card-checklist/card-checklist-store'
import {useCardInfoStore} from '../../card-info/card-info-store'
import {getSearchCard} from '../../get-search-card'
import {Card} from '../../types'
import {JellyfishModel} from '../components/jellyfish-model'

// a function that takes the number of jellyfish and the width of the roof, and returns the required depth.
export const calculateDepthByCount = (count: number, width: number): number => {
  if (count === 0) {
    return 5
  } // minimum size of an empty roof space

  const overhang = CANOPY_CONFIG?.OVERHANG ?? 0.5
  // clear usable width under the roof (for width = 5 and overhang = 0.5, this would be 4 meters)
  const safeWidth = width - overhang * 2

  // a Step Between Jellyfish
  const stepX = 2.0
  const stepZ = 3.0

  // calculate how many JELLYFISH will fit in a single row across the width.
  // for example, a usable width of 4 meters can accommodate: floor(4 / 1.0) + 1 = 5 "jellyfish" units.
  const columns = Math.max(1, Math.floor(safeWidth / stepX) + 1)

  // how many rows will we need for this number of jellyfish (for 42 jellyfish / 5 = 9 rows)
  const rows = Math.ceil(count / columns)

  // calculating the depth: (number of rows - 1) * spacing + margins on both sides
  const requiredDepth = (rows - 1) * stepZ + overhang * 2

  // cap it at an upper limit of 50
  return Math.min(50, Math.max(5, requiredDepth))
}

export const CanopyJellyfish = observer(() => {
  const id = String(getSearchCard())
  const [, cardChecklistStore] = useCardChecklistStore()

  // get the checkboxes here so that the roof knows their quantity.
  const checklist = cardChecklistStore.getCheckboxesCompleted(id)
  const count = checklist?.length ?? 0

  const width = 5 // fixed roof width

  // automatically calculate the depth based on the number of elements.
  const dynamicDepth = calculateDepthByCount(count, width)

  return (
    <group>
      {/* roof will automatically shift along the Z-axis and stretch because `dynamicDepth` is passed into it */}
      <Canopy currentDepth={dynamicDepth} />
    </group>
  )
})

interface ISwimmer {
  actualX: number
  actualZ: number
  checkbox: Checkbox
  card: Card
}

export const JellyfishGrid = observer(
  ({width, depth}: {width: number; depth: number}) => {
    const id = String(getSearchCard())
    const [, cardChecklistStore] = useCardChecklistStore()
    const [cardInfoState] = useCardInfoStore()

    const checklist = cardChecklistStore.getCheckboxesCompleted(id)
    const card = cardInfoState.card.data

    const swimmers = useMemo(() => {
      const result: ISwimmer[] = []
      const count = checklist?.length ?? 0
      if (count === 0) {
        return result
      }

      // factor in safe roof clearances to ensure the jellyfish do not extend beyond the edge.
      const safeWidth = width - (CANOPY_CONFIG?.OVERHANG ?? 0.5) * 2
      const safeDepth = depth - (CANOPY_CONFIG?.OVERHANG ?? 0.5) * 2

      // calculating the grid proportions (how many rows and columns to create)
      const aspectRatio = safeWidth / safeDepth
      const columns = Math.ceil(Math.sqrt(count * aspectRatio))
      const rows = Math.ceil(count / columns)

      // spacing between the jellyfish (if there is only one element, place it in the center)
      const stepX = columns > 1 ? safeWidth / (columns - 1) : 0
      const stepZ = rows > 1 ? safeDepth / (rows - 1) : 0

      // offset to the starting point (top-left corner of the grid within the group)
      const startX = -safeWidth / 2
      const startZ = -safeDepth / 2

      for (let i = 0; i < count; i++) {
        const checkbox = checklist?.[i]
        if (!checkbox || !card) {
          return result
        }

        // determining indices in the matrix
        const col = i % columns
        const row = Math.floor(i / columns)

        // calculate the final local coordinate of each jellyfish.
        const actualX = startX + col * stepX
        const actualZ = startZ + row * stepZ

        result.push({
          actualX,
          actualZ,
          checkbox,
          card
        })
      }
      return result
    }, [checklist, card, width, depth])

    return (
      <group>
        {swimmers?.map(props => (
          <JellyfishRoofSwimmer key={props.checkbox.id} {...props} />
        ))}
      </group>
    )
  }
)

const JellyfishRoofSwimmer = observer(
  ({actualX, actualZ, card, checkbox}: ISwimmer) => {
    const [globalState] = useGlobalStore()
    const {updateCheckboxIsCompleted} = useCheckboxHandlers()

    const groupRef = useRef<Group>(null)

    const config = useMemo(
      () => ({
        wiggleSpeed: 1.5,
        amplitude: 0.1, // oscillation amplitude at the location
        offset: Math.random() * Math.PI * 2,
        scale: 0.012 // a consistently good size
      }),
      []
    )

    // animation of a jellyfish gently swaying in place
    useFrame(state => {
      if (groupRef.current) {
        const time = state.clock.getElapsedTime() + config.offset

        // jellyfish hangs at its grid point but breathes smoothly along the Y and Z axes
        groupRef.current.position.x = actualX
        groupRef.current.position.y =
          Math.sin(time * config.wiggleSpeed) * config.amplitude
        groupRef.current.position.z = actualZ

        // facing downwards (unfolding the canopy)
        // groupRef.current.rotation.set(Math.PI, 0, 0)
      }
    })

    return (
      <group
        ref={groupRef}
        onClick={event => {
          if (globalState.is3DSceneLocked) {
            return
          }
          event.stopPropagation()
          if (checkbox) {
            updateCheckboxIsCompleted(!checkbox.is_completed, checkbox.id)
          }
        }}
      >
        <JellyfishModel
          grid
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
