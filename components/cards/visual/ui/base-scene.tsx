import {Loader, PointerLockControls} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import {Floor} from '../components/floor'
import {Lights} from '../components/lights'
import {Snowfall} from './base-snowfall'

interface BasicSceneProps {
  children: React.ReactNode
}

const BasicScene = ({children}: BasicSceneProps) => {
  return (
    <div style={{height: 'calc(100vh - 41px)', width: '100vw'}}>
      <Canvas shadows camera={{fov: 50}}>
        <Lights />

        <Physics gravity={[0, -9.8, 0]}>
          {children}
          <Floor color="white" />
        </Physics>
        <Snowfall />
        <PointerLockControls />
      </Canvas>
      <Loader />
    </div>
  )
}

export default BasicScene
