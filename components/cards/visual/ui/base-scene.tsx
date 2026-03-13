import {Loader} from '@/components/common/loader'
import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {BooleanHookState, useBoolean} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {Environment, Html, Sky, useProgress} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import {IconBrowserMaximize} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {CSSProperties, RefObject, Suspense} from 'react'
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
  const isCalculated = useBoolean(false)

  return (
    <div
      className="relative overflow-hidden"
      style={
        visualTab ? canvasInsideModalContainerStyles : canvasContainerStyles
      }
    >
      <ButtonsAboveCanvas isLocked={isLocked} />
      {isCalculated.value && (
        <JoysticksAboveCanvas moveData={moveData} lookData={lookData} />
      )}
      <Canvas selectedVisual={selectedVisual}>
        <Suspense fallback={<CanvasLoader />}>
          {/* Environment map for realistic reflections */}
          <Environment preset="sunset" />
          <Lights />
          <Physics gravity={[0, -9.8, 0]}>
            {children}
            <Floor color="white" />
          </Physics>
          <Sky sunPosition={[5, 10, 5]} turbidity={0.25} />
          {selectedVisual === 'winter' && <Snowfall />}
          <RenderNotifier onFirstFrame={isCalculated} />
        </Suspense>
      </Canvas>
      {!isMobile && isCalculated.value && <TwDot />}
    </div>
  )
}

const RenderNotifier = ({onFirstFrame}: {onFirstFrame: BooleanHookState}) => {
  useFrame(state => {
    // gl.render counts frames. Check if we have rendered at least 1-2 frames
    if (state.gl.info.render.calls > 0 && !onFirstFrame.value) {
      onFirstFrame.turnOn()
    }
  })
  return null
}

const CanvasLoader = () => {
  const {progress} = useProgress()
  return (
    <Html center>
      <div className="flex justify-center items-center gap-2 w-full h-full text-violet-400">
        <Loader />
        <span>{progress.toFixed(0)}%</span>
      </div>
    </Html>
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

const ButtonsAboveCanvas = observer(
  ({isLocked}: {isLocked: BooleanHookState}) => {
    const [, store] = useGlobalStore()
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
            onClick={() => {
              store.setVisualModalFromRightDrawerOpen(true)
              updateSearchParams('visual-tab', 'true')
            }}
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
)
