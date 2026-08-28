/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export interface CanopyParams {
  width: number
  height: number
  depth: number
}

export class CanopyScene {
  private container: HTMLDivElement
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private animationFrameId: number | null = null
  private isDestroyed = false

  private mainStructureGroup = new THREE.Group()
  private templates: Record<string, THREE.Object3D> = {}

  private onReadyCallback?: () => void

  // Пул об'єктів-груп
  private poolInitialized = false
  private maxColumns = 8
  private maxCorners = 16
  private maxKrokvu = 70
  private maxRoofBoards = 70

  private poolColumns: THREE.Group[] = []
  private poolCorners: THREE.Group[] = []
  private poolKrokvuB: THREE.Group[] = []
  private poolKrokvuA: THREE.Group[] = []
  private poolRoofBoards: THREE.Group[] = []
  private poolBeams: Record<string, THREE.Group> = {}
  private poolFrieze: Record<string, THREE.Group> = {}
  private poolRuberoid: THREE.Group | null = null
  private poolProfile: Record<string, THREE.Group> = {}

  private loadGLTF(url: string): Promise<GLTF> {
    const loader = new GLTFLoader()
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        gltf => resolve(gltf),
        undefined,
        error => reject(error)
      )
    })
  }

  constructor(container: HTMLDivElement, onReady?: () => void) {
    this.container = container
    this.onReadyCallback = onReady
    this.initThree()
    void this.initAssets()
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

    this.scene.add(new THREE.GridHelper(20, 20))
    window.addEventListener('resize', this.handleResize)
  }

  private animate = (): void => {
    if (this.isDestroyed) {
      return
    }
    this.animationFrameId = requestAnimationFrame(this.animate)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private async initAssets(): Promise<void> {
    try {
      const [modelsGltf, materialsGltf] = await Promise.all([
        this.loadGLTF('/canopy/Canopy_Models.glb'),
        this.loadGLTF('/canopy/Canopy_Materials.glb')
      ])

      if (this.isDestroyed) {
        return
      }

      const materialsRegistry: Record<string, THREE.MeshStandardMaterial> = {}
      materialsGltf.scene.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          if (mesh.material && !Array.isArray(mesh.material)) {
            materialsRegistry[mesh.material.name] =
              mesh.material as THREE.MeshStandardMaterial
          }
        }
      })

      const realMeshNames = [
        'balk_150x150x2200',
        'balk_150x150x1000',
        'balk_corner',
        'Lodge_20x190x1000_bevel',
        'Lodge_20x200x1000',
        'lodge_150x50x200',
        'lodge_150x50x1000',
        'profile_canopy_perimeter_closed',
        'ruberoid_1000x1000x2'
      ]

      for (const name of realMeshNames) {
        const rawObj = modelsGltf.scene.getObjectByName(name)
        if (rawObj) {
          const isolatedClone = rawObj.clone(true)

          isolatedClone.traverse(child => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh
              if (
                mesh.material &&
                !Array.isArray(mesh.material) &&
                materialsRegistry[mesh.material.name]
              ) {
                mesh.material = materialsRegistry[mesh.material.name]
              }
              mesh.castShadow = true
              mesh.receiveShadow = true
            }
          })

          this.templates[name] = isolatedClone
        }
      }

      this.initPool()
      if (this.onReadyCallback) {
        this.onReadyCallback()
      }
    } catch (error) {
      console.error('Помилка ініціалізації GLB ассетів:', error)
    }
  }

  private createPivotGroup(templateName: string): THREE.Group {
    const group = new THREE.Group()
    const meta = this.templates[templateName]
    if (!meta) {
      return group
    }

    const model = meta.clone(true)

    // Центруємо геометрію всередині локальної групи Box3-методом
    const box = new THREE.Box3().setFromObject(model)
    const center = new THREE.Vector3()
    box.getCenter(center)
    model.position.sub(center)

    group.add(model)
    group.visible = false
    this.mainStructureGroup.add(group)
    return group
  }

  private initPool() {
    if (this.poolInitialized) {
      return
    }

    for (let i = 0; i < this.maxColumns; i++) {
      this.poolColumns.push(this.createPivotGroup('balk_150x150x2200'))
    }
    for (let i = 0; i < this.maxCorners; i++) {
      this.poolCorners.push(this.createPivotGroup('balk_corner'))
    }

    const sides = ['left', 'right', 'front', 'back']
    sides.forEach(side => {
      this.poolBeams[side] = this.createPivotGroup('balk_150x150x1000')
    })

    const friezeKeys = [
      'left_inner',
      'right_inner',
      'front_inner',
      'back_inner',
      'left_outer',
      'right_outer',
      'front_outer',
      'back_outer'
    ]
    friezeKeys.forEach(key => {
      this.poolFrieze[key] = this.createPivotGroup('Lodge_20x200x1000')
    })

    for (let i = 0; i < this.maxKrokvu; i++) {
      this.poolKrokvuB.push(this.createPivotGroup('lodge_150x50x1000'))
      this.poolKrokvuA.push(this.createPivotGroup('lodge_150x50x200'))
    }

    for (let i = 0; i < this.maxRoofBoards; i++) {
      this.poolRoofBoards.push(this.createPivotGroup('Lodge_20x190x1000_bevel'))
    }

    this.poolRuberoid = this.createPivotGroup('ruberoid_1000x1000x2')

    const poolProfileKeys = ['left', 'right', 'front', 'back']
    poolProfileKeys.forEach(key => {
      this.poolProfile[key] = this.createPivotGroup(
        'profile_canopy_perimeter_closed'
      )
    })

    this.poolInitialized = true
  }

  public update(params: CanopyParams): void {
    if (!this.poolInitialized || this.isDestroyed) {
      return
    }
    const {width, height, depth} = params
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

    const colWidth = 0.15
    const overhang = 0.18
    const boardThickness = 0.02
    const beamHeight = 0.15

    const krokvuHeight = 0.15
    const roofY = height

    // Ховаємо пул перед оновленням слайдерів
    const allPools = [
      this.poolColumns,
      this.poolCorners,
      this.poolKrokvuB,
      this.poolKrokvuA,
      this.poolRoofBoards
    ]
    allPools.forEach(p => p.forEach(m => (m.visible = false)))
    Object.values(this.poolBeams).forEach(b => (b.visible = false))
    Object.values(this.poolFrieze).forEach(f => (f.visible = false))
    if (this.poolRuberoid) {
      this.poolRuberoid.visible = false
    }
    Object.values(this.poolProfile).forEach(f => (f.visible = false))

    try {
      // Розрахунок кутових осей симетрії відносно центру сцени (0,0)
      const halfW = width / 2 - colWidth / 2
      const halfD = depth / 2 - colWidth / 2

      // =========================================================================
      // 1. КОЛОНИ ТА УКОСИНИ
      // =========================================================================

      const colPositions = [
        {
          x: -halfW,
          z: halfD,
          colRot: 0,
          leftRot: Math.PI / 2,
          rightRot: Math.PI
        },
        {
          x: halfW,
          z: halfD,
          colRot: 0,
          leftRot: 0,
          rightRot: Math.PI / 2
        },
        {
          x: halfW,
          z: -halfD,
          colRot: 0,
          leftRot: -Math.PI / 2,
          rightRot: 0
        },
        {
          x: -halfW,
          z: -halfD,
          colRot: 0,
          leftRot: Math.PI,
          rightRot: -Math.PI / 2
        }
      ]

      // ДИНАМІЧНА ПЕРЕВІРКА ШИРИНИ (Перед і Зад): Якщо більше 4 метрів, додаємо центральні колони
      if (width > 4.0) {
        // Центральна передня колона
        colPositions.push({
          x: 0,
          z: halfD, // чітко по центру X (0), притиснута до переднього краю
          colRot: 0,
          leftRot: Math.PI, // Ліва укосина підпирає балку ліворуч від центра
          rightRot: 0 // Права укосина підпирає балку праворуч від центра
        })

        // Central задняя колона
        colPositions.push({
          x: 0,
          z: -halfD, // чітко по центру X (0), притиснута до заднього краю
          colRot: 0,
          leftRot: 0, // Ліва укосина йде ліворуч
          rightRot: Math.PI // Права укосина йде праворуч
        })
      }

      // ДИНАМІЧНА ПЕРЕВІРКА ГЛИБИНІ (Ліва і Права стіни): Якщо більше 4 метрів, додаємо бічні центральні колони
      if (depth > 4.0) {
        // Центральна ліва колона
        colPositions.push({
          x: -halfW,
          z: 0, // притиснута ліворуч, чітко по центру Z (0)
          colRot: 0,
          leftRot: -Math.PI / 2, // укосина йде вперед
          rightRot: Math.PI / 2 // укосина йде назад
        })

        // Центральна права колона
        colPositions.push({
          x: halfW,
          z: 0, // притиснута праворуч, чітко по центру Z (0)
          colRot: 0,
          leftRot: Math.PI / 2, // укосина йде вперед
          rightRot: -Math.PI / 2 // укосина йде назад
        })
      }

      // Ховаємо абсолютно ВСІ колони та укосини перед новим прорахунком кадрів,
      // щоб старі центральні опори зникали, коли  зменшуємо розмір менше 4 метрів
      this.poolColumns.forEach(c => (c.visible = false))
      this.poolCorners.forEach(c => (c.visible = false))

      colPositions.forEach((pos, idx) => {
        const col = this.poolColumns[idx]
        if (col) {
          col.position.set(pos.x, height / 2, pos.z)
          col.scale.set(1, height / 2.2, 1)
          col.rotation.set(0, pos.colRot, 0)
          col.visible = true
        }

        const cLeft = this.poolCorners[idx * 2]
        const cRight = this.poolCorners[idx * 2 + 1]

        if (cLeft) {
          cLeft.position.set(pos.x, roofY - 0.2, pos.z)
          cLeft.rotation.set(Math.PI, pos.leftRot, Math.PI)

          // Зсуваємо укосину локально вбік на 30 см
          cLeft.translateX(0.3)

          cLeft.scale.set(1, 1, 1)
          cLeft.visible = true
        }

        if (cRight) {
          cRight.position.set(pos.x, roofY - 0.2, pos.z)
          cRight.rotation.set(Math.PI, pos.rightRot, Math.PI)

          // Аналогічно виштовхуємо другу укосину з тіла суміжній балки
          cRight.translateX(0.3)

          cRight.scale.set(1, 1, 1)
          cRight.visible = true
        }
      })

      // =========================================================================
      // 2. КІЛЬЦЕВІ БАЛКИ (balk_150x150x1000)
      // =========================================================================
      const beamMeta = this.templates['balk_150x150x1000']
      if (beamMeta) {
        // Визначаємо метрову довжину завантаженого бруса
        const baseL = 1.0
        const beamsY = roofY + beamHeight / 2
        const shortLen = width - colWidth * 2

        // ЛІВА БАЛКА: Оскільки модель лежить по X, після повороту на 90°
        // її довжина все одно масштабується по локальній осі X
        if (this.poolBeams['left']) {
          this.poolBeams['left'].position.set(-halfW, beamsY, 0)
          this.poolBeams['left'].rotation.set(0, Math.PI / 2, 0)

          // розрахунок довжини на першу позицію (X), а Z робимо 1
          this.poolBeams['left'].scale.set(depth / baseL, 1, 1)

          this.poolBeams['left'].visible = true
        }

        // ПРАВА БАЛКА: Аналогічно лівій — масштабуємо довжину по осі X
        if (this.poolBeams['right']) {
          this.poolBeams['right'].position.set(halfW, beamsY, 0)
          this.poolBeams['right'].rotation.set(0, Math.PI / 2, 0)

          // розрахунок довжини на першу позицію (X), а Z робимо 1
          this.poolBeams['right'].scale.set(depth / baseL, 1, 1)

          this.poolBeams['right'].visible = true
        }

        // ПЕРЕДНЯ БАЛКА: лежить по ширині. Оскільки модель витягнута по Z,
        // крутимо її на 90° (Math.PI / 2), тому вісь її довжини в скроєній групі
        // перетворюється на вісь X. Щоб товщина не постраждала, міняємо параметри скейлу місцями!
        if (this.poolBeams['front']) {
          this.poolBeams['front'].position.set(0, beamsY, halfD)
          this.poolBeams['front'].rotation.set(0, 0, 0)
          // розтягуємо довжину по X (перший параметр), а товщину по Z затискаємо в 1
          this.poolBeams['front'].scale.set(shortLen / baseL, 1, 1)
          this.poolBeams['front'].visible = true
        }

        // ЗАДНЯ БАЛКА: аналогічно передній — розтягуємо довжину по X, товщину тримаємо 1
        if (this.poolBeams['back']) {
          this.poolBeams['back'].position.set(0, beamsY, -halfD)
          this.poolBeams['back'].rotation.set(0, 0, 0)
          // розтягуємо довжину по X (перший параметр), а товщину по Z затискаємо в 1
          this.poolBeams['back'].scale.set(shortLen / baseL, 1, 1)
          this.poolBeams['back'].visible = true
        }
      }

      // =========================================================================
      // 3. ДОШКИ БОКОВІ (ФРИЗИ) (Lodge_20x200x1000)
      // =========================================================================

      const friezeMeta = this.templates['Lodge_20x200x1000']
      if (friezeMeta) {
        const baseL = 1.0
        const innerFriezeHeight = 0.2
        const outerFriezeHeight = 0.135

        // Висоти Y для двох рівнів згідно з ТЗ
        const innerFriezeY = roofY + 0.1 + innerFriezeHeight / 2 // Внутрішній (+100мм)
        const outerFriezeY = roofY + 0.1 + outerFriezeHeight / 2 + 0.1 // Зовнішній (+200мм)

        const friezeLongLength = depth + overhang * 2
        const friezeShortLength = width + overhang * 2

        // Повна конфігурація для Внутрішнього та Зовнішнього фризів
        const friezeConfig = [
          // ВНУТРІШНІЙ ФРИЗ (+100мм — 100% робоча схема з поворотом для ліво/право)
          {
            key: 'left_inner',
            x: -width / 2 - boardThickness / 2 - overhang,
            z: 0,
            y: innerFriezeY,
            rot: Math.PI / 2,
            scale: friezeLongLength + boardThickness * 2
          },
          {
            key: 'right_inner',
            x: width / 2 + boardThickness / 2 + overhang,
            z: 0,
            y: innerFriezeY,
            rot: Math.PI / 2,
            scale: friezeLongLength + boardThickness * 2
          },
          {
            key: 'front_inner',
            x: 0,
            z: depth / 2 + boardThickness / 2 + overhang,
            y: innerFriezeY,
            rot: 0,
            scale: friezeShortLength
          },
          {
            key: 'back_inner',
            x: 0,
            z: -depth / 2 - boardThickness / 2 - overhang,
            y: innerFriezeY,
            rot: 0,
            scale: friezeShortLength
          },

          // ЗОВНІШНІЙ ФРИЗ (+200мм — Дзеркально копіює логіку поворотів внутрішнього)
          {
            key: 'left_outer',
            x: -width / 2 - boardThickness * 1.5 - overhang,
            z: 0,
            y: outerFriezeY,
            rot: Math.PI / 2,
            scale: friezeLongLength + boardThickness * 2
          },
          {
            key: 'right_outer',
            x: width / 2 + boardThickness * 1.5 + overhang,
            z: 0,
            y: outerFriezeY,
            rot: Math.PI / 2,
            scale: friezeLongLength + boardThickness * 2
          },
          {
            key: 'front_outer',
            x: 0,
            z: depth / 2 + boardThickness * 1.5 + overhang,
            y: outerFriezeY,
            rot: 0,
            scale: friezeShortLength + boardThickness * 4
          },
          {
            key: 'back_outer',
            x: 0,
            z: -depth / 2 - boardThickness * 1.5 - overhang,
            y: outerFriezeY,
            rot: 0,
            scale: friezeShortLength + boardThickness * 4
          }
        ]

        friezeConfig.forEach(cfg => {
          const board = this.poolFrieze[cfg.key]
          if (board) {
            board.position.set(cfg.x, cfg.y, cfg.z)
            board.rotation.set(0, cfg.rot, 0)
            board.scale.set(cfg.scale / baseL, 1, 1) // чистий скейл по довжині X
            board.visible = true
          }
        })
      }

      // =========================================================================
      // 4. КРОКВИ БРУС B ТА ВИНОСНІ ВСТАВКИ А
      // =========================================================================
      const krokB_Meta = this.templates['lodge_150x50x1000']
      if (krokB_Meta) {
        const baseL = 1.0
        const krokvuY = roofY + beamHeight + krokvuHeight / 2

        // --- 1. РОЗРАХУНОК ДЛЯ ГОЛОВНИХ КРОКВ БРУС B (Крок по ГЛИБИНІ Z) ---
        const distanceCentersZ = depth - colWidth
        const maxStepB = 0.5
        const segmentsB = Math.ceil(distanceCentersZ / maxStepB)
        const countB = Math.min(segmentsB + 1, this.maxKrokvu)
        const exactStepB = distanceCentersZ / segmentsB

        const startZ = halfD

        // 1. Спочатку виставляємо стандартні центральні крокви, які йдуть по ширині X
        // меншуємо цикл на 2 елементи, щоб залишити дві крокви з пулу для бокового закриття
        for (let i = 0; i < countB; i++) {
          const bBeam = this.poolKrokvuB[i]
          const posZ = startZ - i * exactStepB

          if (bBeam) {
            bBeam.position.set(0, krokvuY, posZ)
            bBeam.rotation.set(0, 0, 0) // лежать рівно вздовж X

            // Залишаємо стандартну довжину з виносима
            const totalRequiredWidth = width + overhang * 2
            bBeam.scale.set(totalRequiredWidth / baseL, 1, 1)
            bBeam.visible = true
          }
        }

        // 2. БЕРЕМО ДВІ КРОКВИ З КІНЦЯ ПУЛУ І СТАВИМО ЇХ ПОПЕРЕК (ВЗДОВЖ Z)
        // Обчислюємо повну довжину бокового звису даху
        const sideBeamLength = depth + overhang * 2

        // Ліва поперечна кроква (закриває діри з лівого боку)
        const leftClosingBeam = this.poolKrokvuB[this.maxKrokvu - 2]
        if (leftClosingBeam) {
          // Притискаємо її до лівого внутрішнього краю фриза
          leftClosingBeam.position.set(-width / 2, krokvuY, 0)

          // РОЗВЕРТАЄМО НА 90 ГРАДУСІВ, щоб вона лягла поперек основних крокв вздовж Z
          leftClosingBeam.rotation.set(0, Math.PI / 2, 0)

          // Розтягуємо її рідну довжину X під повну глибину даху
          leftClosingBeam.scale.set(sideBeamLength / baseL, 1, 1)
          leftClosingBeam.visible = true
        }

        // Права поперечна кроква (закриває діри з правого боку)
        const rightClosingBeam = this.poolKrokvuB[this.maxKrokvu - 1]
        if (rightClosingBeam) {
          // Притискаємо її до правого внутрішнього краю фриза
          rightClosingBeam.position.set(width / 2, krokvuY, 0)

          // РОЗВЕРТАЄМО НА 90 ГРАДУСІВ вздовж осей Z
          rightClosingBeam.rotation.set(0, Math.PI / 2, 0)

          // Розтягуємо її рідну довжину X під повну глибину даху
          rightClosingBeam.scale.set(sideBeamLength / baseL, 1, 1)
          rightClosingBeam.visible = true
        }

        // --- 2. САМОСТІЙНИЙ РОЗРАХУНОК ДЛЯ ВСТАВОК А (Крок по ШИРИНІ X) ---
        // Рахуємо повну ширину даху разом із бічними виносами фризів з обох боків,
        // щоб крайні кобилки автоматично доїхали до самого краю покрівлі
        const totalWidthRoofA = width + overhang * 2
        const maxStepA = 0.5
        const segmentsA = Math.ceil(totalWidthRoofA / maxStepA)

        const countA = segmentsA - 1
        const exactStepX = totalWidthRoofA / segmentsA

        // Стартуємо строго з крайньої лівої точки покрівлі (з урахуванням boardThickness)
        const startX = -halfW - boardThickness

        // Обнуляємо видимість пулу вставок А перед циклом
        this.poolKrokvuA.forEach(m => (m.visible = false))

        // цикл розстановки вставок А, пропорційний ПОВНІЙ ширині даху
        for (let j = 1; j < countA; j++) {
          const posX = startX + j * exactStepX

          const aFront = this.poolKrokvuA[j * 2]
          const aBack = this.poolKrokvuA[j * 2 + 1]

          // ПЕРЕДНЯ ВСТАВКА А: під передній фриз
          if (aFront) {
            aFront.position.set(posX, krokvuY, halfD + overhang / 2)
            aFront.rotation.set(0, Math.PI / 2, 0)
            aFront.scale.set(1, 1, 1)
            aFront.visible = true
          }

          // ЗАДНЯ ВСТАВКА А: під задній фриз
          if (aBack) {
            aBack.position.set(posX, krokvuY, -halfD - overhang / 2)
            aBack.rotation.set(0, Math.PI / 2, 0)
            aBack.scale.set(1, 1, 1)
            aBack.visible = true
          }
        }
      }

      // =========================================================================
      // 5. НАСТИЛ ВАГОНКА (Lodge_20x190x1000_bevel)
      // =========================================================================

      const roofBoardsY = roofY + beamHeight * 2

      const boardMeta = this.templates['Lodge_20x190x1000_bevel']
      if (boardMeta) {
        const baseL = 1.0
        const boardWidth = 0.19 // 190 мм чиста ширина дошки вагонки

        // Розраховуємо повну глибину даху з урахуванням виносів фризів
        const totalDepthRoof = depth + overhang * 2

        // 1. Рахуємо кількість цілих дошок та залишок
        // ВИПРАВЛЕННЯ: Округляємо до 4 знаків після коми (до десятої частки міліметра)
        // Це повністю прибере баг JS з плаваючою крапкою
        const totalFullBoards = Math.floor(
          Number(totalDepthRoof.toFixed(4)) / boardWidth
        )

        // Рахуємо чистий залишок також з округленням
        const remainderWidth = Number(
          (totalDepthRoof - totalFullBoards * boardWidth).toFixed(4)
        )

        // Стартова точка заповнення від крайнього переднього виносу фриза
        // Додаємо половину глибини конструкції, щоб виштовхнути масив наперед
        const startRoofZ = depth / 2 + overhang - boardWidth / 2

        // console.log('totalFullBoards: ', totalFullBoards)
        // console.log('totalBoardsWidth: ', totalFullBoards * boardWidth)
        // console.log('totalDepthRoof: ', totalDepthRoof)
        // console.log('remainderWidth: ', remainderWidth)

        // Спочатку виводимо цілі дошки
        let i = 0
        for (; i < totalFullBoards; i++) {
          const board = this.poolRoofBoards[i]
          if (board) {
            const posZ = startRoofZ - i * boardWidth

            // 1. Позиція: дошка лежить по центру ширини, на потрібній висоті Y,
            // і крок за кроком зміщується назад по Z
            board.position.set(0, roofBoardsY, posZ)

            // 2. Поворот: розгортаємо дошку на 90 градусів по колу (Math.PI / 2),
            // щоб вона лягла упоперек навісу (вздовж ширини по X)
            board.rotation.set(0, Math.PI / 2, 0)

            // 3. Масштабування: оскільки модель у Blender витягнута по Z,
            // розтягуємо її довжину строго по Z, щоб вона перекрила всю ширину
            board.scale.set(1, 1, (width + overhang * 2) / baseL)

            board.visible = true
          }
        }
        // 2. Додаємо фінальну дошку (залишок), якщо він є і суттєвий (наприклад, більше 5 мм)
        if (remainderWidth > 0.005) {
          const lastBoard = this.poolRoofBoards[i] // Беремо наступну дошку з пулу
          if (lastBoard) {
            // Зсуваємо Z на відстань усіх цілих дошок + половина ширини залишку
            const posZ =
              startRoofZ -
              totalFullBoards * boardWidth -
              remainderWidth / 2 +
              boardWidth / 2

            // Обчислюємо коефіцієнт стиснення по ширині (Blend-модель по осі X)
            const widthScale = remainderWidth / boardWidth

            lastBoard.position.set(0, roofBoardsY, posZ)
            lastBoard.rotation.set(0, Math.PI / 2, 0)

            // scale.x стискає дошку, scale.z розтягує довжину
            lastBoard.scale.set(widthScale, 1, (width + overhang * 2) / baseL)

            lastBoard.visible = true
          }
        }

        // БЛОК 3: Ховаємо всі інші невикористані дошки з пулу, які залишилися
        for (let j = i + 1; j < this.poolRoofBoards.length; j++) {
          if (this.poolRoofBoards[j]) {
            this.poolRoofBoards[j].visible = false
          }
        }
      }

      // =========================================================================
      // 6. ПОКРИТТЯ ДАХУ (Руберойд) ТА ПРОФІЛЬ
      // =========================================================================
      const ruberoidMeta = this.templates['ruberoid_1000x1000x2']
      if (ruberoidMeta) {
        const baseSize = 1.0
        const finalY = roofBoardsY + 0.01 // лягає строго поверх вагонки
        const totalW = width + overhang * 2
        const totalD = depth + overhang * 2

        if (this.poolRuberoid) {
          this.poolRuberoid.position.set(0, finalY, 0)
          // Масштабуємо площину рівномірно по X та Z
          this.poolRuberoid.scale.set(totalW / baseSize, 1, totalD / baseSize)
          this.poolRuberoid.visible = true
        }

        // 2. БУДУЄМО МЕТАЛЕВУ РАМКУ З 4-Х БОКІВ ПРОФІЛЮ (67х134 мм)
        const profileMeta = this.templates['profile_canopy_perimeter_closed']
        if (profileMeta && this.poolProfile) {
          const baseProfL = 1.0 // Базова довжина одного бруска профілю в Blender

          // Довжина коротких (перед/зад) та довгих (ліво/право) сторін профілю
          const profLongLen = depth + overhang * 2
          const profShortLen = width + overhang * 2 + 0.134 // Для заповнення пустоти

          // Профіль ставимо на 4 мм вище руберойду, щоб не було Z-fighting
          const profY = finalY + 0.04

          // ПЕРЕДНІЙ ПРОФІЛЬ: лягає на передній кант (Z = totalD/2) вздовж X
          if (this.poolProfile['front']) {
            this.poolProfile['front'].position.set(0, profY, totalD / 2)
            this.poolProfile['front'].rotation.set(0, 0, 0) // без поворотів, лежить по X
            this.poolProfile['front'].scale.set(profShortLen / baseProfL, 1, 1) // МАСШТАБУЄМО ТІЛЬКИ ДОВЖИНУ ПО X
            this.poolProfile['front'].visible = true
          }

          // ЗАДНІЙ ПРОФІЛЬ: лягає на задній кант (Z = -totalD/2) вздовж X
          if (this.poolProfile['back']) {
            this.poolProfile['back'].position.set(0, profY, -totalD / 2)
            this.poolProfile['back'].rotation.set(0, -Math.PI, 0) // розвертаємо вглиб сцени
            this.poolProfile['back'].scale.set(profShortLen / baseProfL, 1, 1)
            this.poolProfile['back'].visible = true
          }

          // ЛІВИЙ ПРОФІЛЬ: лягає на лівий кант (X = -totalW/2).
          // Повертаємо на 90 градусів вздовж Z, але скейлимо ДОВЖИНУ завжди по X!
          if (this.poolProfile['left']) {
            this.poolProfile['left'].position.set(-totalW / 2, profY, 0)
            this.poolProfile['left'].rotation.set(0, -Math.PI / 2, 0) // розвертаємо вглиб сцени
            this.poolProfile['left'].scale.set(profLongLen / baseProfL, 1, 1) // МАСШТАБУЄМО ДОВЖИНУ ПО X
            this.poolProfile['left'].visible = true
          }

          // ПРАВИЙ ПРОФІЛЬ: лягає на правий кант (X = totalW/2)
          if (this.poolProfile['right']) {
            this.poolProfile['right'].position.set(totalW / 2, profY, 0)
            this.poolProfile['right'].rotation.set(0, Math.PI / 2, 0) // розвертаємо вглиб сцени
            this.poolProfile['right'].scale.set(profLongLen / baseProfL, 1, 1) // МАСШТАБУЄМО ДОВЖИНУ ПО X
            this.poolProfile['right'].visible = true
          }
        }
      }
    } catch (err) {
      console.error('Помилка в ітерації:', err)
    }
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
    this.renderer.dispose()
    this.container.innerHTML = ''
    this.isDestroyed = true
  }
}
