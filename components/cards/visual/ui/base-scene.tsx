import {Button} from '@/components/daisyui/button'
import {BooleanHookState} from '@/hooks/use-boolean'
import {Environment, Loader, PointerLockControls} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import {isMobile} from 'react-device-detect'
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
  isLocked: BooleanHookState
  children: React.ReactNode
}

const BasicScene = ({children, isLocked}: BasicSceneProps) => {
  return (
    <div style={{height: 'calc(100vh - 74px)', width: '100vw'}}>
      {!isMobile && (
        <>
          {!isLocked.value ? (
            <Button
              soft
              color="info"
              className="h-14 m-2 absolute z-10"
              id="enter-btn"
            >
              Enter First Person With Movement by WASD keys and spacebar
            </Button>
          ) : (
            <div className="m-2 text-pretty absolute z-10 text-neutral-400">
              press ESC to Exit First Person
            </div>
          )}
        </>
      )}

      <Canvas
        shadows
        camera={{fov: 50, position: [-0.2, -1, 5]}}
        className="rounded-md"
      >
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
      {!isMobile && <TwDot />}
    </div>
  )
}

export default BasicScene
