'use client'
import * as THREE from 'three'
import {CanopyAssetLoader} from './canopy-asset-loader'
import {CanopyBuilder} from './canopy-builder'
import {CANOPY_CONFIG, CanopyParams} from './canopy-config'
import {CanopyPool} from './canopy-pool'

// extends THREE.Group so that R3F can work with this object directly
export class CanopyScene extends THREE.Group {
  private assetLoader = new CanopyAssetLoader()
  // pass `this` (since this class is a group)
  private pool = new CanopyPool(this)
  private builder = new CanopyBuilder(this.pool)

  constructor() {
    super() // initializing THREE.Group
  }

  public async initContext(): Promise<void> {
    try {
      const templates = await this.assetLoader.loadAssets()
      this.pool.init(templates)
    } catch (error) {
      console.error('Помилка ініціалізації CanopyScene сервісів:', error)
      throw error
    }
  }

  public update(params: CanopyParams): void {
    const {width, height, depth} = params
    if (!this.pool.initialized) {
      return
    }

    if (
      Number.isNaN(width) ||
      Number.isNaN(height) ||
      Number.isNaN(depth) ||
      width < 2 ||
      height < 2 ||
      depth < 2
    ) {
      return
    }

    this.pool.hideAll()

    try {
      const halfW = width / 2 - CANOPY_CONFIG.COL_WIDTH / 2
      const halfD = depth / 2 - CANOPY_CONFIG.COL_WIDTH / 2

      this.builder.buildColumnsAndCorners(params, halfW, halfD, height)
      this.builder.buildBeams(params, halfW, halfD, height)
      this.builder.buildFrieze(params, height)

      const roofBoardsY = this.builder.buildKrokvu(params, halfW, halfD, height)
      const finalY = this.builder.buildRoofBoards(params, roofBoardsY)
      this.builder.buildRoofCoverAndProfile(params, finalY)
    } catch (err) {
      console.error('Помилка в ітерації:', err)
    }
  }
}
