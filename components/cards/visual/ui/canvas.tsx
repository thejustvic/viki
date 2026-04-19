import {Stats} from '@react-three/drei'
import {Canvas as CanvasComponent, useFrame, useThree} from '@react-three/fiber'
import {PropsWithChildren} from 'react'
import {isMobile} from 'react-device-detect'

export const Canvas = ({children}: PropsWithChildren) => {
  return (
    <CanvasComponent
      flat
      shadows={isMobile ? 'basic' : 'soft'}
      camera={{
        fov: 50,
        far: 2000
      }}
      className="rounded-md relative"
      dpr={1} // 1 for maximum FPS
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
