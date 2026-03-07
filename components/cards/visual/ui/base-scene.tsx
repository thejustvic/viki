import {Button} from '@/components/daisyui/button'
import {BooleanHookState} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {Environment, Loader} from '@react-three/drei'
import {Physics} from '@react-three/rapier'
import {IconBrowserMaximize} from '@tabler/icons-react'
import {CSSProperties, RefObject} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {CardVisualType} from '../../types'
import {Floor} from '../components/floor'
import {Lights} from '../components/lights'
import {Snowfall} from './base-snowfall'
import {Canvas} from './canvas'
import {DualJoysticks, Vector2} from './joystick'

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
  border
  border-white
`

export const canvasContainerStyles: CSSProperties = {
  height: 'calc(100vh - 74px)',
  width: '100vw'
}

export const canvasInsideModalContainerStyles: CSSProperties = {
  height: '100%',
  width: '100%',
  minWidth: 0,
  minHeight: 0
}

interface BasicSceneProps {
  selectedVisual: CardVisualType[number]
  children: React.ReactNode
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
  isLocked: BooleanHookState
}

export const BasicScene = ({
  children,
  selectedVisual,
  moveData,
  lookData,
  isLocked
}: BasicSceneProps) => {
  const visualTab = getSearchParam('visual-tab')

  return (
    <div
      className="relative overflow-hidden"
      style={
        visualTab ? canvasInsideModalContainerStyles : canvasContainerStyles
      }
    >
      <ButtonsAboveCanvas isLocked={isLocked} />
      <JoysticksAboveCanvas moveData={moveData} lookData={lookData} />
      <Canvas selectedVisual={selectedVisual}>
        {/* Environment map for realistic reflections */}
        <Environment preset="sunset" />
        <Lights />
        <Physics gravity={[0, -9.8, 0]}>
          {children}
          <Floor color="white" />
        </Physics>
        {selectedVisual === 'winter' && <Snowfall />}
      </Canvas>
      <Loader />
      {!isMobile && <TwDot />}
    </div>
  )
}

interface JoysticksProps {
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
}

const JoysticksAboveCanvas = ({moveData, lookData}: JoysticksProps) => {
  if (!isMobile) {
    return null
  }
  return (
    <DualJoysticks
      onMove={v => (moveData.current = v)}
      onLook={v => (lookData.current = v)}
    />
  )
}

const ButtonsAboveCanvas = ({isLocked}: {isLocked: BooleanHookState}) => {
  const visualTab = getSearchParam('visual-tab')
  const updateSearchParams = useUpdateSearchParams()

  if (isMobile) {
    return null
  }
  return isLocked.value ? (
    <>
      <Button
        soft
        color="info"
        className={twJoin('absolute h-14 ml-2 mt-2 mr-2 z-10')}
        id="enter-btn"
      >
        Enter First Person With Movement by WASD keys and spacebar
      </Button>
      {!visualTab && (
        <Button
          soft
          color="info"
          className={twJoin(
            visualTab ? 'mt-2' : 'mt-18',
            'absolute h-14 ml-2 z-10'
          )}
          onClick={() => updateSearchParams('visual-tab', 'true')}
        >
          <IconBrowserMaximize />
        </Button>
      )}
    </>
  ) : (
    <div className="m-2 text-pretty absolute z-10 text-neutral-400">
      press ESC to Exit First Person
    </div>
  )
}
