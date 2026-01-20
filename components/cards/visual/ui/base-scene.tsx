import {Button} from '@/components/daisyui/button'
import {useBoolean} from '@/hooks/use-boolean'
import {Environment, Loader, PointerLockControls} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import tw from 'tailwind-styled-components'
import {Floor} from '../components/floor'
import {Lights} from '../components/lights'
import {Snowfall} from './base-snowfall'

const TwDot = tw.div`
  absolute
  top-1/2
  left-1/2
  w-3
  h-3
  rounded-full
  transform
  -translate-x-1/2
  -translate-y-1/2
  border-1
  border-white
`

interface BasicSceneProps {
  children: React.ReactNode
}

const BasicScene = ({children}: BasicSceneProps) => {
  const isLocked = useBoolean(false)
  return (
    <div style={{height: 'calc(100vh - 41px)', width: '100vw'}}>
      {!isLocked.value ? (
        <Button className="m-2 absolute z-10" id="enter-btn">
          Enter First Person With Movement by WASD keys
        </Button>
      ) : (
        <div className="m-2 text-pretty absolute z-10 text-neutral-400">
          press ESC to Exit First Person
        </div>
      )}
      <Canvas shadows camera={{fov: 50, position: [-0.2, -1, 5]}}>
        <Lights />

        <Physics gravity={[0, -9.8, 0]}>
          {children}
          <Floor color="white" />
        </Physics>
        <Snowfall />

        {/* Environment map for realistic reflections */}
        <Environment preset="sunset" />

        <PointerLockControls
          selector="#enter-btn"
          onLock={isLocked.turnOn}
          onUnlock={isLocked.turnOff}
        />
      </Canvas>
      <Loader />
      <TwDot />
    </div>
  )
}

export default BasicScene
