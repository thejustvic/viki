/* eslint-disable max-lines-per-function */
import {Button} from '@/components/daisyui/button'
import {BooleanHookState} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {AdaptiveDpr, Environment, Loader, Stats} from '@react-three/drei'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import {IconBrowserMaximize} from '@tabler/icons-react'
import {CSSProperties, RefObject, useMemo} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {CardVisualType} from '../../types'
import {Floor} from '../components/floor'
import {Lights} from '../components/lights'
import {Snowfall} from './base-snowfall'
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

interface BasicSceneProps {
  selectedVisual: CardVisualType[number]
  children: React.ReactNode
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
  isLocked: BooleanHookState
}

type CameraPosition = [x: number, y: number, z: number]

export const BasicScene = ({
  children,
  selectedVisual,
  moveData,
  lookData,
  isLocked
}: BasicSceneProps) => {
  const cameraPosition = useMemo(() => {
    const winterCameraPosition: CameraPosition = [-0.1, -0.7, 5]
    const springCameraPosition: CameraPosition = [-0.1, 1.7, 5]

    return selectedVisual === 'winter'
      ? winterCameraPosition
      : springCameraPosition
  }, [selectedVisual])
  const visualTab = getSearchParam('visual-tab')
  const updateSearchParams = useUpdateSearchParams()

  return (
    <div
      className="relative overflow-hidden"
      style={
        visualTab
          ? {
              height: '100%',
              width: '100%',
              minWidth: 0,
              minHeight: 0
            }
          : canvasContainerStyles
      }
    >
      {!isMobile && (
        <>
          {isLocked.value ? (
            <>
              <Button
                soft
                color="info"
                className={twJoin('h-14 ml-2 mt-2 absolute z-10 mr-2')}
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
                    'h-14 ml-2 absolute z-10'
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
          )}
        </>
      )}

      {isMobile && (
        <>
          <DualJoysticks
            onMove={v => (moveData.current = v)}
            onLook={v => (lookData.current = v)}
          />
        </>
      )}

      <Canvas
        flat
        shadows={!isMobile}
        camera={{
          fov: 50,
          position: cameraPosition
        }}
        className="rounded-md relative"
        gl={{logarithmicDepthBuffer: true, antialias: false}}
        dpr={[1, 1.5]}
      >
        <AdaptiveDpr pixelated />

        <Lights />

        <Physics gravity={[0, -9.8, 0]}>
          {children}
          <Floor color="white" />
        </Physics>

        {selectedVisual === 'winter' && <Snowfall />}

        {/* Environment map for realistic reflections */}
        <Environment preset="sunset" />

        {process.env.NODE_ENV === 'development' && (
          <>
            <Stats />
            <InfoLogger />
          </>
        )}
      </Canvas>
      <Loader />
      {!isMobile && <TwDot />}
    </div>
  )
}

// write in the browser console: window.logStats = true
const InfoLogger = () => {
  const {gl} = useThree()

  useFrame(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.logStats) {
      const stats = {
        'Polygons (Triangles)': gl.info.render.triangles,
        'Vertices (Points)': gl.info.render.points,
        'Draw Calls': gl.info.render.calls
      }
      console.table(stats)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.logStats = false
    }
  })
  return null
}
