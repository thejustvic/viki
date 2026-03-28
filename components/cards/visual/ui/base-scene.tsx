import {Loader} from '@/components/common/loader'
import tw from '@/components/common/tw-styled-components'
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
import {RefObject, Suspense} from 'react'
import {isMobile} from 'react-device-detect'
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

const canvasInsideModalContainerClasses = `
  h-full
  w-full
  min-h-px
  min-w-px
`
export const canvasContainerClasses = `
  h-[calc(100vh-74px)]
  w-screen
`
interface ITwWrapper {
  $isVisualTab: boolean
}
const TwWrapper = tw.div<ITwWrapper>`
  ${({$isVisualTab}) => ($isVisualTab ? canvasInsideModalContainerClasses : canvasContainerClasses)}
  relative
  overflow-hidden
`

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
    <TwWrapper $isVisualTab={Boolean(visualTab)}>
      <ButtonsAboveCanvas isLocked={isLocked} />
      {isCalculated.value && (
        <JoysticksAboveCanvas moveData={moveData} lookData={lookData} />
      )}
      <Canvas>
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
    </TwWrapper>
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

const TwCanvasLoader = tw.div`
  flex
  justify-center
  items-center
  gap-2
  w-full
  h-full
  text-violet-400
`

const CanvasLoader = () => {
  const {progress} = useProgress()
  return (
    <Html center>
      <TwCanvasLoader>
        <Loader />
        <span>{progress.toFixed(0)}%</span>
      </TwCanvasLoader>
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

const TwEnterButton = tw(Button)`
  absolute
  h-14
  ml-2
  mt-2
  mr-2
  z-10
`
interface ITwChangeView {
  $inTab: boolean
}
const TwChangeView = tw.div<ITwChangeView>`
  ${({$inTab}) => ($inTab ? 'ml-6' : 'ml-22')}
  absolute
  h-14
  mt-22
  mr-4
  z-10
  text-neutral-400
`

const TwModalButton = tw(Button)`
  absolute
  h-14
  ml-2
  mt-18
  z-10
`

const TwExit = tw.div`
  m-2
  text-pretty
  absolute
  z-10
  text-neutral-400
`

const TwEggs = tw.div`
  right-0
  m-2
  text-pretty
  absolute
  z-10
  font-bold
  text-xl
  p-2
  py-0
  rounded
  text-accent/80
  bg-accent-content/80
  drop-shadow-xl/25
`

const ButtonsAboveCanvas = observer(
  ({isLocked}: {isLocked: BooleanHookState}) => {
    const [, store] = useGlobalStore()
    const visualTab = getSearchParam('visual-tab')
    const updateSearchParams = useUpdateSearchParams()

    if (isMobile) {
      return <GameModeInfo />
    }
    return isLocked.value ? (
      <>
        <TwEnterButton soft color="info" id="enter-btn">
          Enter First Person With Movement by WASD keys and spacebar
        </TwEnterButton>
        <TwChangeView $inTab={Boolean(visualTab)}>
          shift+v for view change
        </TwChangeView>
        {!visualTab && (
          <TwModalButton
            soft
            color="info"
            onClick={() => {
              store.setVisualModalFromRightDrawerOpen(true)
              updateSearchParams('visual-tab', 'true')
            }}
          >
            <IconBrowserMaximize />
          </TwModalButton>
        )}
      </>
    ) : (
      <>
        <TwExit>press ESC to Exit First Person</TwExit>
        <GameModeInfo />
      </>
    )
  }
)

const GameModeInfo = observer(() => {
  const [state] = useGlobalStore()
  return (
    <>
      {state.gameMode === 'egg-collecting' && (
        <TwEggs>
          {state.eggsLeftToCollect === 0
            ? 'all Easter eggs collected!'
            : `${state.eggsLeftToCollect} eggs left to collect`}
        </TwEggs>
      )}
    </>
  )
})
