import {DolphinScene} from './dolphin-scene'
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
      </mesh>
      <OceanSand />
    </>
  )
}
