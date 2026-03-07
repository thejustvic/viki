import {Stats} from '@react-three/drei'
import {Canvas as CanvasComponent, useFrame, useThree} from '@react-three/fiber'
import {PropsWithChildren, useMemo} from 'react'
import {isMobile} from 'react-device-detect'
import {CardVisualType} from '../../types'

interface Props extends PropsWithChildren {
  selectedVisual: CardVisualType[number]
}

type CameraPosition = [x: number, y: number, z: number]

export const Canvas = ({children, selectedVisual}: Props) => {
  const cameraPosition = useMemo(() => {
    const winterCameraPosition: CameraPosition = [-0.1, -0.7, 5]
    const springCameraPosition: CameraPosition = [-0.1, 1.7, 5]

    return selectedVisual === 'winter'
      ? winterCameraPosition
      : springCameraPosition
  }, [selectedVisual])

  return (
    <CanvasComponent
      flat
      shadows={!isMobile}
      camera={{
        fov: 50,
        position: cameraPosition
      }}
      className="rounded-md relative"
      dpr={selectedVisual === 'winter' ? 1.5 : 1} // 1 for maximum FPS
    >
      {children}

      {process.env.NODE_ENV === 'development' && (
        <>
          <Stats />
          <InfoLogger />
        </>
      )}
    </CanvasComponent>
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
