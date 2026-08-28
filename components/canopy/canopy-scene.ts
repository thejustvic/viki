import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {CanopyAssetLoader} from './canopy-asset-loader'
import {CanopyBuilder} from './canopy-builder'
import {CANOPY_CONFIG, CanopyParams} from './canopy-config'
import {CanopyPool} from './canopy-pool'

export class CanopyScene {
  private container: HTMLDivElement
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private animationFrameId: number | null = null
  private isDestroyed = false

  private mainStructureGroup = new THREE.Group()
  private assetLoader = new CanopyAssetLoader()
  private pool = new CanopyPool(this.mainStructureGroup)
  private builder = new CanopyBuilder(this.pool)
  private onReadyCallback?: () => void

  constructor(container: HTMLDivElement, onReady?: () => void) {
    this.container = container
    this.onReadyCallback = onReady
    this.initThree()
    void this.initContext()
    this.animate()
  }

  private initThree() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf0f0f0)
    this.scene.add(this.mainStructureGroup)

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    )
    this.camera.position.set(6, 6, 8)

    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    )
    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05

    this.initLighting()
    this.scene.add(new THREE.GridHelper(20, 20))
    window.addEventListener('resize', this.handleResize)
  }

  private initLighting() {
    // 1. Загальне розсіяне світло (Ambient Light)
    // Збільшуємо інтенсивність до 0.8, щоб повністю підсвітити тіні під навісом
    // та проявити внутрішню вагонку й укосини
    this.scene.add(new THREE.AmbientLight(0xfff222, 1))

    // 2. Головне сонячне світло (Directional Light)
    // Збільшуємо яскравість до 1.2. Воно падає зверху під кутом,
    // створюючи яскраві відблиски на гранях сріблястого профілю даху
    const dirLight = new THREE.DirectionalLight(0xfff222, 1)
    dirLight.position.set(10, 20, 10)

    // Вмикаємо м'які тіні для реалістичності каркаса
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    this.scene.add(dirLight)

    // Підсвічування знизу (Hemisphere Light)
    // Воно імітує відблиск світла від землі
    const hemiLight = new THREE.HemisphereLight(0xfff, 0x144, 1)
    hemiLight.position.set(0, 20, 0)
    this.scene.add(hemiLight)

    // ГЕНЕРАТОР ВІДОБРАЖЕНЬ (Рятує від чорноти PBR-матеріали з Blender)
    // Він бере додане світло і створює з нього карту оточення
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    pmremGenerator.compileEquirectangularShader()

    // Створюємо карту відображень з поточної сцени і призначаємо її як глобальне оточення
    this.scene.environment = pmremGenerator.fromScene(this.scene).texture
    pmremGenerator.dispose()
  }

  private async initContext(): Promise<void> {
    try {
      const templates = await this.assetLoader.loadAssets(
        () => this.isDestroyed
      )
      if (this.isDestroyed) {
        return
      }

      this.pool.init(templates)
      this.onReadyCallback?.()
    } catch (error) {
      console.error('Помилка ініціалізації CanopyScene сервісів:', error)
    }
  }

  public update(params: CanopyParams): void {
    const {width, height, depth} = params
    if (!this.pool.initialized || this.isDestroyed) {
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

    // Ховаємо пул перед оновленням слайдерів
    this.pool.hideAll()

    try {
      // Розрахунок кутових осей симетрії відносно центру сцени (0,0)
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

  private animate = (): void => {
    if (this.isDestroyed) {
      return
    }
    this.animationFrameId = requestAnimationFrame(this.animate)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private handleResize = (): void => {
    if (!this.container || !this.renderer || this.isDestroyed) {
      return
    }
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    )
  }

  public destroy(): void {
    window.removeEventListener('resize', this.handleResize)
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    this.mainStructureGroup.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose())
        } else {
          mesh.material.dispose()
        }
      }
    })

    this.renderer.dispose()
    this.container.innerHTML = ''
    this.isDestroyed = true
  }
}
