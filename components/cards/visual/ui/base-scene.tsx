import {Loader} from '@/components/common/loader'
import tw from '@/components/common/tw-styled-components'
import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {BooleanHookState, useBoolean} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {Html, useProgress} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {Physics, RapierRigidBody} from '@react-three/rapier'
import {IconBrowserMaximize} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren, RefObject, Suspense} from 'react'
import {isMobile} from 'react-device-detect'
import {useCardInfoStore} from '../../card-info/card-info-store'
import {Lighting} from '../components/lights'
import {pluralize} from '../utils/helpers'
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

interface BasicSceneProps extends PropsWithChildren {
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
  rigidBodyRef: RefObject<RapierRigidBody | null>
}
export const BasicScene = ({
  children,
  moveData,
  lookData,
  rigidBodyRef
}: BasicSceneProps) => {
  const visualTab = getSearchParam('visual-tab')
  const isReady = useBoolean(false)

  return (
    <TwWrapper $isVisualTab={Boolean(visualTab)}>
      {isReady.value && (
        <>
          <ButtonsAboveCanvas />
          <JoysticksAboveCanvas moveData={moveData} lookData={lookData} />
        </>
      )}
      <Canvas>
        <Suspense fallback={<CanvasLoader />}>
          <Lighting playerRef={rigidBodyRef} />
          <Physics gravity={[0, -9.81, 0]}>{children}</Physics>
          <RenderNotifier onFirstFrame={isReady} />
        </Suspense>
      </Canvas>
      {!isMobile && isReady.value && <TwDot />}
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

const TwChangeView = tw.div`
  absolute
  mt-10
  ml-2
  z-10
  text-neutral-400
`

const colorsCompleted = `
  text-accent/80
  bg-accent-content/80
`

const colorsNotCompleted = `
  text-info/80
  bg-info-content/80
`

interface ITwEggs {
  $isCompleted: boolean
}
const TwEggs = tw.div<ITwEggs>`
  ${({$isCompleted}) => ($isCompleted ? colorsCompleted : colorsNotCompleted)}
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
  drop-shadow-xl/25
`

const ButtonsAboveCanvas = observer(() => {
  const [state, store] = useGlobalStore()
  const visualTab = getSearchParam('visual-tab')
  const updateSearchParams = useUpdateSearchParams()

  const view = state.isThirdPersonView
    ? 'Third Person View'
    : 'First Person View'

  if (isMobile) {
    return <GameModeInfo />
  }
  return state.is3DSceneLocked ? (
    <>
      <TwEnterButton soft color="info" id="enter-btn">
        Enter {view} With Movement by WASD keys and spacebar
      </TwEnterButton>
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
      <TwExit>press ESC to Exit {view}</TwExit>
      <TwChangeView>press v for view change</TwChangeView>
      <GameModeInfo />
    </>
  )
})

const GameModeInfo = observer(() => {
  const [globalState] = useGlobalStore()
  const [cardState] = useCardInfoStore()
  const {eggsLeftToCollect, gameMode} = globalState
  const {
    card: {data}
  } = cardState

  const isCompleted = eggsLeftToCollect === 0
  return (
    <>
      {gameMode === 'egg-collecting' && data?.selected_visual === 'spring' && (
        <TwEggs $isCompleted={isCompleted}>
          {isCompleted
            ? 'all Easter eggs collected!'
            : `${pluralize(eggsLeftToCollect, 'Easter egg')} left to collect`}
        </TwEggs>
      )}
    </>
  )
})
