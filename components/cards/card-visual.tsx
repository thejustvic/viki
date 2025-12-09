import {Sky} from '@react-three/drei'
import BaseBox from './visual/ui/base-box'
import BaseCharacter from './visual/ui/base-character'
import BaseScene from './visual/ui/base-scene'

export default function CardVisual() {
  return (
    <BaseScene>
      <BaseBox position={[-2, 1, -5]} args={[1, 1, 1]} color="green" />
      <BaseBox position={[0, 1, -5]} args={[1, 2, 1]} color="red" />
      <BaseBox position={[2, 1, -5]} args={[1, 3, 1]} color="orange" />

      <BaseCharacter position={[0, 1, 0]} args={[0.5]} />

      <Sky />
    </BaseScene>
  )
}
