import {DolphinScene} from './dolphin-scene'
import {OceanGodRays} from './ocean-godrays'
import {OceanPlankton} from './ocean-plankton'
import {OceanSand} from './ocean-sand'
import {OceanWalls} from './ocean-walls'
import {OceanWater} from './ocean-water'

export const Ocean = () => {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, -55]}>
        <OceanWater />
        <OceanWalls />
        <OceanPlankton count={1500} area={[100, 30, 100]} />
        <OceanGodRays />
        <DolphinScene />
      </mesh>
      <OceanSand />
    </>
  )
}
