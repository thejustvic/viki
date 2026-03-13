import {PerformanceMonitor, Stats} from '@react-three/drei'
import {Canvas as CanvasComponent, useFrame, useThree} from '@react-three/fiber'
import {PropsWithChildren, useMemo, useState} from 'react'
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

  const [dpr, setDpr] = useState(1.25)

  return (
    <CanvasComponent
      frameloop="demand"
      flat
      shadows={!isMobile}
      camera={{
        fov: 50,
        position: cameraPosition
      }}
      className="rounded-md relative"
      dpr={dpr} // 1 for maximum FPS
    >
      <PerformanceMonitor
        onIncline={() => setDpr(1.5)}
        onDecline={() => setDpr(1)}
      />

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
