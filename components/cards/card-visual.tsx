import {useBoolean} from '@/hooks/use-boolean'
import {Sky} from '@react-three/drei'
import {Checkbox} from '../checklist/types'
import {CardInfoStore} from './card-info/card-info-store'
import {TreeModel} from './visual/components/tree-model'
import BaseBox from './visual/ui/base-box'
import {BaseCharacter} from './visual/ui/base-character'
import BaseScene from './visual/ui/base-scene'
import {ConeWithSpheres} from './visual/ui/cone'

export default function CardVisual({
  checklist,
  cardInfoState
}: {
  checklist: Checkbox[]
  cardInfoState: CardInfoStore['state']['card']
}) {
  const isLocked = useBoolean(false)

  const baseHeight = 3.2
  const baseRadius = 1
  const baseScale = 0.15
  const referenceCount = 15

  const scaleFactor = Math.sqrt(
    Math.max(referenceCount, checklist.length) / referenceCount
  )

  const coneHeight = baseHeight * scaleFactor
  const coneRadius = baseRadius * scaleFactor
  const dynamicTreeScale = baseScale * scaleFactor

  const baseTreeScale = 0.15
  const treeGroundY = -0.1
  const scaleDiff = dynamicTreeScale - baseTreeScale

  // Correction (The bigger the tree, the lower we lower the center)
  // If it "jumps", we need to subtract the height
  // Try a factor of 5 to 15 depending on the model
  const heightCorrection = scaleDiff * 5

  const dynamicTreeY = treeGroundY - heightCorrection

  const coneGroundY = 1

  // PIVOT FIX
  // Since the object grows from the center, we raise its center by half the height
  const dynamicConeY = coneGroundY + coneHeight / 2

  const sphereRadius = scaleFactor > 1.2 ? 0.2 : 0.15
  const minRequiredDistance = sphereRadius * 3

  return (
    <BaseScene isLocked={isLocked}>
      <ConeWithSpheres
        checklist={checklist}
        cardInfoState={cardInfoState}
        coneHeight={coneHeight}
        coneRadius={coneRadius}
        dynamicConeY={dynamicConeY}
        sphereRadius={sphereRadius}
        minRequiredDistance={minRequiredDistance}
      />

      <TreeModel position={[0, dynamicTreeY, -10]} scale={dynamicTreeScale} />

      <BaseBox position={[5, 1, -8]} args={[1, 1, 1]} color="green" />
      <BaseBox position={[5, 1, -6]} args={[1, 2, 1]} color="red" />
      <BaseBox position={[5, 1, -4]} args={[1, 3, 1]} color="orange" />

      <BaseCharacter
        position={[-0.2, 1, -4]}
        args={[0.5]}
        isLocked={isLocked}
      />

      <Sky sunPosition={[5, 10, 5]} turbidity={0.25} />
    </BaseScene>
  )
}
