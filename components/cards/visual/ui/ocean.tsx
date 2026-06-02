import {TurtleModel} from '../components/turtle-model'
import {DolphinScene} from './dolphin-scene'
import {JellyfishTorus} from './jellyfish-torus'
import {OceanGodRays} from './ocean-godrays'
import {OceanPlankton} from './ocean-plankton'
import {OceanSand} from './ocean-sand'
import {OceanWater} from './ocean-water'

export const Ocean = () => {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <OceanWater />
        <OceanPlankton />
        <OceanGodRays />
        <DolphinScene />
        <JellyfishTorus />
      </mesh>
      <OceanSand />
      <group
        rotation={[0, 0, -Math.PI / 32]}
        position={[-30, -150, 0]}
        scale={90}
      >
        <TurtleModel />
      </group>
    </>
  )
}
