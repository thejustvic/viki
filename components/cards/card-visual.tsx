import {Sky} from '@react-three/drei'
import {TreeModel} from './visual/components/tree-model'
import BaseBox from './visual/ui/base-box'
import BaseCharacter from './visual/ui/base-character'
import BaseScene from './visual/ui/base-scene'
import {BaseSphere} from './visual/ui/base-sphere'

export default function CardVisual() {
  return (
    <BaseScene>
      <TreeModel position={[0, -1, -10]} scale={0.3} />

      <BaseSphere position={[0, 2, -8]} text="Merry Xmas" />

      <BaseBox position={[5, 1, -8]} args={[1, 1, 1]} color="green" />
      <BaseBox position={[5, 1, -6]} args={[1, 2, 1]} color="red" />
      <BaseBox position={[5, 1, -4]} args={[1, 3, 1]} color="orange" />

      <BaseCharacter position={[0, 1, 0]} args={[0.5]} />

      <Sky sunPosition={[5, 10, 5]} turbidity={0.25} />
    </BaseScene>
  )
}
