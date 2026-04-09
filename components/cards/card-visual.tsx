import {RapierRigidBody} from '@react-three/rapier'
import {observer} from 'mobx-react-lite'
import {useRef} from 'react'
import {useGlobalStore} from '../global-provider/global-store'
import {Floor} from './visual/components/floor'
import {BaseCharacter} from './visual/ui/base-character'
import {BasicScene} from './visual/ui/base-scene'
import {Snowfall} from './visual/ui/base-snowfall'
import {ConeWithSpheres} from './visual/ui/cone'
import {Ocean} from './visual/ui/ocean'
import {Snowland} from './visual/ui/snowland'
import {Tulip} from './visual/ui/tulip'

type Vector2 = {x: number; y: number}

export const CardVisual = () => {
  const moveData = useRef<Vector2>({x: 0, y: 0})
  const lookData = useRef<Vector2>({x: 0, y: 0})
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  return (
    <BasicScene
      moveData={moveData}
      lookData={lookData}
      rigidBodyRef={rigidBodyRef}
    >
      <PhysicsContent />
      <BaseCharacter
        moveData={moveData}
        lookData={lookData}
        rigidBodyRef={rigidBodyRef}
      />
    </BasicScene>
  )
}

const PhysicsContent = observer(() => {
  const [{selectedVisualMode}] = useGlobalStore()

  return (
    <>
      {selectedVisualMode === 'spring' && (
        <>
          <Tulip />
          <Floor color="white" />
        </>
      )}
      {selectedVisualMode === 'winter' && (
        <>
          <ConeWithSpheres />
          <Snowfall />
          <Snowland />
        </>
      )}
      {selectedVisualMode === 'summer' && <Ocean />}
    </>
  )
})
