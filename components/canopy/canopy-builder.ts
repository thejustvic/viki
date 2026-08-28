import {CANOPY_CONFIG, CanopyParams} from './canopy-config'
import {CanopyPool} from './canopy-pool'

export class CanopyBuilder {
  private pool: CanopyPool

  constructor(pool: CanopyPool) {
    this.pool = pool
  }

  public buildColumnsAndCorners(
    params: CanopyParams,
    halfW: number,
    halfD: number,
    roofY: number
  ) {
    // =========================================================================
    // 1. КОЛОНИ ТА УКОСИНИ
    // =========================================================================
    const colPositions = [
      {x: -halfW, z: halfD, colRot: 0, leftRot: Math.PI / 2, rightRot: Math.PI},
      {x: halfW, z: halfD, colRot: 0, leftRot: 0, rightRot: Math.PI / 2},
      {x: halfW, z: -halfD, colRot: 0, leftRot: -Math.PI / 2, rightRot: 0},
      {
        x: -halfW,
        z: -halfD,
        colRot: 0,
        leftRot: Math.PI,
        rightRot: -Math.PI / 2
      }
    ]

    // ДИНАМІЧНА ПЕРЕВІРКА ШИРИНИ (Перед і Зад): Якщо більше 4 метрів, додаємо центральні колони
    if (params.width > 4.0) {
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
    if (params.depth > 4.0) {
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
    // щоб старі центральні опори зникали, коли зменшуємо розмір менше 4 метрів
    // (Примітка: цей крок тепер централізовано виконує метод pool.hideAll())

    colPositions.forEach((pos, idx) => {
      const col = this.pool.columns[idx]
      if (col) {
        col.position.set(pos.x, params.height / 2, pos.z)
        col.scale.set(1, params.height / 2.2, 1)
        col.rotation.set(0, pos.colRot, 0)
        col.visible = true
      }

      const cLeft = this.pool.corners[idx * 2]
      const cRight = this.pool.corners[idx * 2 + 1]

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
  }

  public buildBeams(
    params: CanopyParams,
    halfW: number,
    halfD: number,
    roofY: number
  ) {
    // =========================================================================
    // 2. КІЛЬЦЕВІ БАЛКИ (balk_150x150x1000)
    // =========================================================================
    const beamsY = roofY + CANOPY_CONFIG.BEAM_HEIGHT / 2
    const shortLen = params.width - CANOPY_CONFIG.COL_WIDTH * 2
    const baseL = CANOPY_CONFIG.BASE_MODEL_LEN

    // ЛІВА БАЛКА: Оскільки модель лежить по X, після повороту на 90°
    // її довжина все одно масштабується по локальній осі X
    if (this.pool.beams['left']) {
      this.pool.beams['left'].position.set(-halfW, beamsY, 0)
      this.pool.beams['left'].rotation.set(0, Math.PI / 2, 0)

      // розрахунок довжини на першу позицію (X), а Z робимо 1
      this.pool.beams['left'].scale.set(params.depth / baseL, 1, 1)
      this.pool.beams['left'].visible = true
    }

    // ПРАВА БАЛКА: Аналогічно лівій — масштабуємо довжину по осі X
    if (this.pool.beams['right']) {
      this.pool.beams['right'].position.set(halfW, beamsY, 0)
      this.pool.beams['right'].rotation.set(0, Math.PI / 2, 0)

      // розрахунок довжини на першу позицію (X), а Z робимо 1
      this.pool.beams['right'].scale.set(params.depth / baseL, 1, 1)
      this.pool.beams['right'].visible = true
    }

    // ПЕРЕДНЯ БАЛКА: лежить по ширині. Оскільки модель витягнута по Z,
    // крутимо її на 90° (Math.PI / 2), тому вісь її довжини в скроєній групі
    // перетворюється на вісь X. Щоб товщина не постраждала, міняємо параметри скейлу місцями!
    if (this.pool.beams['front']) {
      this.pool.beams['front'].position.set(0, beamsY, halfD)
      this.pool.beams['front'].rotation.set(0, 0, 0)
      // розтягуємо довжину по X (перший параметр), а товщину по Z затискаємо в 1
      this.pool.beams['front'].scale.set(shortLen / baseL, 1, 1)
      this.pool.beams['front'].visible = true
    }

    // ЗАДНЯ БАЛКА: аналогічно передній — розтягуємо довжину по X, товщину тримаємо 1
    if (this.pool.beams['back']) {
      this.pool.beams['back'].position.set(0, beamsY, -halfD)
      this.pool.beams['back'].rotation.set(0, 0, 0)
      // розтягуємо довжину по X (перший параметр), а товщину по Z затискаємо в 1
      this.pool.beams['back'].scale.set(shortLen / baseL, 1, 1)
      this.pool.beams['back'].visible = true
    }
  }

  public buildFrieze(params: CanopyParams, roofY: number) {
    // =========================================================================
    // 3. ДОШКИ БОКОВІ (ФРИЗИ) (Lodge_20x200x1000)
    // =========================================================================
    const baseL = CANOPY_CONFIG.BASE_MODEL_LEN
    const thick = CANOPY_CONFIG.BOARD_THICKNESS
    const over = CANOPY_CONFIG.OVERHANG

    // Висоти Y для двох рівнів згідно з ТЗ
    const innerFriezeY = roofY + 0.1 + CANOPY_CONFIG.FRIEZE_INNER_H / 2 // Внутрішній (+100мм)
    const outerFriezeY = roofY + 0.1 + CANOPY_CONFIG.FRIEZE_OUTER_H / 2 + 0.1 // Зовнішній (+200мм)

    const friezeLongLength = params.depth + over * 2
    const friezeShortLength = params.width + over * 2

    // Повна конфігурація для Внутрішнього та Зовнішнього фризів
    const friezeConfig = [
      // ВНУТРІШНІЙ ФРИЗ (+100мм — 100% робоча схема з поворотом для ліво/право)
      {
        key: 'left_inner',
        x: -params.width / 2 - thick / 2 - over,
        z: 0,
        y: innerFriezeY,
        rot: Math.PI / 2,
        scale: friezeLongLength + thick * 2
      },
      {
        key: 'right_inner',
        x: params.width / 2 + thick / 2 + over,
        z: 0,
        y: innerFriezeY,
        rot: Math.PI / 2,
        scale: friezeLongLength + thick * 2
      },
      {
        key: 'front_inner',
        x: 0,
        z: params.depth / 2 + thick / 2 + over,
        y: innerFriezeY,
        rot: 0,
        scale: friezeShortLength
      },
      {
        key: 'back_inner',
        x: 0,
        z: -params.depth / 2 - thick / 2 - over,
        y: innerFriezeY,
        rot: 0,
        scale: friezeShortLength
      },

      // ЗОВНІШНІЙ ФРИЗ (+200мм — Дзеркально копіює логіку поворотів внутрішнього)
      {
        key: 'left_outer',
        x: -params.width / 2 - thick * 1.5 - over,
        z: 0,
        y: outerFriezeY,
        rot: Math.PI / 2,
        scale: friezeLongLength + thick * 2
      },
      {
        key: 'right_outer',
        x: params.width / 2 + thick * 1.5 + over,
        z: 0,
        y: outerFriezeY,
        rot: Math.PI / 2,
        scale: friezeLongLength + thick * 2
      },
      {
        key: 'front_outer',
        x: 0,
        z: params.depth / 2 + thick * 1.5 + over,
        y: outerFriezeY,
        rot: 0,
        scale: friezeShortLength + thick * 4
      },
      {
        key: 'back_outer',
        x: 0,
        z: -params.depth / 2 - thick * 1.5 - over,
        y: outerFriezeY,
        rot: 0,
        scale: friezeShortLength + thick * 4
      }
    ]

    friezeConfig.forEach(cfg => {
      const board = this.pool.frieze[cfg.key]
      if (board) {
        board.position.set(cfg.x, cfg.y, cfg.z)
        board.rotation.set(0, cfg.rot, 0)
        board.scale.set(cfg.scale / baseL, 1, 1) // чистий скейл по довжині X
        board.visible = true
      }
    })
  }

  public buildKrokvu(
    params: CanopyParams,
    halfW: number,
    halfD: number,
    roofY: number
  ): number {
    // =========================================================================
    // 4. КРОКВИ БРУС B ТА ВИНОСНІ ВСТАВКИ А
    // =========================================================================
    const baseL = CANOPY_CONFIG.BASE_MODEL_LEN
    const krokvuY =
      roofY + CANOPY_CONFIG.BEAM_HEIGHT + CANOPY_CONFIG.KROKVU_HEIGHT / 2

    // --- 1. РОЗРАХУНОК ДЛЯ ГОЛОВНИХ КРОКВ БРУС B (Крок по ГЛИБИНІ Z) ---
    const distanceCentersZ = params.depth - CANOPY_CONFIG.COL_WIDTH
    const maxStepB = CANOPY_CONFIG.MAX_STEP
    const segmentsB = Math.ceil(distanceCentersZ / maxStepB)
    const countB = Math.min(segmentsB + 1, this.pool.maxKrokvu)
    const exactStepB = distanceCentersZ / segmentsB

    const startZ = halfD

    // 1. Спочатку виставляємо стандартні центральні крокви, які йдуть по ширині X
    // меншуємо цикл на 2 елементи, щоб залишити дві крокви з пулу для бокового закриття
    for (let i = 0; i < countB; i++) {
      const bBeam = this.pool.krokvuB[i]
      const posZ = startZ - i * exactStepB

      if (bBeam) {
        bBeam.position.set(0, krokvuY, posZ)
        bBeam.rotation.set(0, 0, 0) // лежать рівно вздовж X

        // Залишаємо стандартну довжину з виносима
        const totalRequiredWidth = params.width + CANOPY_CONFIG.OVERHANG * 2
        bBeam.scale.set(totalRequiredWidth / baseL, 1, 1)
        bBeam.visible = true
      }
    }

    // 2. БЕРЕМО ДВІ КРОКВИ З КІНЦЯ ПУЛУ І СТАВИМО ЇХ ПОПЕРЕК (ВЗДОВЖ Z)
    // Обчислюємо повну довжину бокового звису даху
    const sideBeamLength = params.depth + CANOPY_CONFIG.OVERHANG * 2

    // Ліва поперечна кроква (закриває діри з лівого боку)
    const leftClosingBeam = this.pool.krokvuB[this.pool.maxKrokvu - 2]
    if (leftClosingBeam) {
      // Притискаємо її до лівого внутрішнього краю фриза
      leftClosingBeam.position.set(-params.width / 2, krokvuY, 0)

      // РОЗВЕРТАЄМО НА 90 ГРАДУСІВ, щоб вона лягла поперек основних крокв вздовж Z
      leftClosingBeam.rotation.set(0, Math.PI / 2, 0)

      // Розтягуємо її рідну довжину X під повну глибину даху

      leftClosingBeam.scale.set(sideBeamLength / baseL, 1, 1)
      leftClosingBeam.visible = true
    }
    // Права поперечна кроква (закриває діри з правого боку)
    const rightClosingBeam = this.pool.krokvuB[this.pool.maxKrokvu - 1]
    if (rightClosingBeam) {
      // Притискаємо її до правого внутрішнього краю фриза
      rightClosingBeam.position.set(params.width / 2, krokvuY, 0)
      // РОЗВЕРТАЄМО НА 90 ГРАДУСІВ вздовж осей Z
      rightClosingBeam.rotation.set(0, Math.PI / 2, 0)
      // Розтягуємо її рідну довжину X під повну глибину даху
      rightClosingBeam.scale.set(sideBeamLength / baseL, 1, 1)
      rightClosingBeam.visible = true
    }
    // --- 2. САМОСТІЙНИЙ РОЗРАХУНОК ДЛЯ ВСТАВОК А (Крок по ШИРИНІ X) ---
    // Рахуємо повну ширину даху разом із бічними виносами фризів з обох боків,
    // щоб крайні кобилки автоматично доїхали до самого краю покрівлі
    const totalWidthRoofA = params.width + CANOPY_CONFIG.OVERHANG * 2
    const maxStepA = CANOPY_CONFIG.MAX_STEP
    const segmentsA = Math.ceil(totalWidthRoofA / maxStepA)
    const countA = segmentsA - 1
    const exactStepX = totalWidthRoofA / segmentsA
    // Стартуємо строго з крайньої лівої точки покрівлі (з урахуванням boardThickness)
    const startX = -halfW - CANOPY_CONFIG.BOARD_THICKNESS
    // Цикл розстановки вставок А, пропорційний ПОВНІЙ ширині даху
    for (let j = 1; j < countA; j++) {
      const posX = startX + j * exactStepX
      const aFront = this.pool.krokvuA[j * 2]
      const aBack = this.pool.krokvuA[j * 2 + 1]
      // ПЕРЕДНЯ ВСТАВКА А: під передній фриз
      if (aFront) {
        aFront.position.set(posX, krokvuY, halfD + CANOPY_CONFIG.OVERHANG / 2)
        aFront.rotation.set(0, Math.PI / 2, 0)
        aFront.scale.set(1, 1, 1)
        aFront.visible = true
      }
      // ЗАДНЯ ВСТАВКА А: під задній фриз
      if (aBack) {
        aBack.position.set(posX, krokvuY, -halfD - CANOPY_CONFIG.OVERHANG / 2)
        aBack.rotation.set(0, Math.PI / 2, 0)
        aBack.scale.set(1, 1, 1)
        aBack.visible = true
      }
    }
    return roofY + CANOPY_CONFIG.BEAM_HEIGHT * 2
  }
  public buildRoofBoards(params: CanopyParams, roofBoardsY: number): number {
    // =========================================================================
    // 5. НАСТИЛ ВАГОНКА (Lodge_20x190x1000_bevel)
    // =========================================================================
    const baseL = CANOPY_CONFIG.BASE_MODEL_LEN
    const boardWidth = CANOPY_CONFIG.BOARD_WIDTH // 190 мм чиста ширина дошки вагонки
    // Розраховуємо повну глибину даху з урахуванням виносів фризів
    const totalDepthRoof = params.depth + CANOPY_CONFIG.OVERHANG * 2
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
    // Додаємо половину глибини紋струкції, щоб виштовхнути масив наперед
    const startRoofZ =
      params.depth / 2 + CANOPY_CONFIG.OVERHANG - boardWidth / 2
    // Спочатку виводимо цілі дошки
    let i = 0
    for (; i < totalFullBoards; i++) {
      const board = this.pool.roofBoards[i]
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
        board.scale.set(
          1,
          1,
          (params.width + CANOPY_CONFIG.OVERHANG * 2) / baseL
        )
        board.visible = true
      }
    }
    // 2. Додаємо фінальну дошку (залишок), якщо він є і суттєвий (наприклад, більше 5 мм)
    if (remainderWidth > 0.005) {
      const lastBoard = this.pool.roofBoards[i] // Беремо наступну дошку з пулу
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
        lastBoard.scale.set(
          widthScale,
          1,
          (params.width + CANOPY_CONFIG.OVERHANG * 2) / baseL
        )
        lastBoard.visible = true
      }
    }
    // БЛОК 3: Ховаємо всі інші невикористані дошки з пулу, які залишилися
    // (Примітка: цей крок тепер автоматизовано через pool.hideAll() перед оновленням)
    return roofBoardsY + 0.01
  }
  public buildRoofCoverAndProfile(params: CanopyParams, finalY: number) {
    // =========================================================================
    // 6. ПОКРИТТЯ ДАХУ (Руберойд) ТА ПРОФІЛЬ
    // =========================================================================
    const baseSize = CANOPY_CONFIG.BASE_MODEL_LEN
    const totalW = params.width + CANOPY_CONFIG.OVERHANG * 2
    const totalD = params.depth + CANOPY_CONFIG.OVERHANG * 2
    if (this.pool.ruberoid) {
      this.pool.ruberoid.position.set(0, finalY, 0)
      // Масштабуємо площину рівномірно по X та Z
      this.pool.ruberoid.scale.set(totalW / baseSize, 1, totalD / baseSize)
      this.pool.ruberoid.visible = true
    }
    // 2. БУДУЄМО МЕТАЛЕВУ РАМКУ З 4-Х БОКІВ ПРОФІЛЮ (67х134 мм)
    if (this.pool.profile) {
      const baseProfL = CANOPY_CONFIG.BASE_MODEL_LEN // Базова довжина одного бруска профілю в Blender
      // Довжина коротких (перед/зад) та довгих (ліво/право) сторін профілю
      const profLongLen = params.depth + CANOPY_CONFIG.OVERHANG * 2
      const profShortLen = params.width + CANOPY_CONFIG.OVERHANG * 2 + 0.134 // Для заповнення пустоти
      // Профіль ставимо на 4 мм вище руберойду, щоб не було Z-fighting
      const profY = finalY + 0.04
      // ПЕРЕДНІЙ ПРОФІЛЬ: лягає на передній кант (Z = totalD/2) вздовж X
      if (this.pool.profile['front']) {
        this.pool.profile['front'].position.set(0, profY, totalD / 2)
        this.pool.profile['front'].rotation.set(0, 0, 0) // без поворотів, лежить по X
        this.pool.profile['front'].scale.set(profShortLen / baseProfL, 1, 1) // МАСШТАБУЄМО ТІЛЬКИ ДОВЖИНУ ПО X
        this.pool.profile['front'].visible = true
      }
      // ЗАДНІЙ ПРОФІЛЬ: лягає на задній кант (Z = -totalD/2) вздовж X
      if (this.pool.profile['back']) {
        this.pool.profile['back'].position.set(0, profY, -totalD / 2)
        this.pool.profile['back'].rotation.set(0, -Math.PI, 0) // розвертаємо вглиб сцени
        this.pool.profile['back'].scale.set(profShortLen / baseProfL, 1, 1)
        this.pool.profile['back'].visible = true
      }
      // ЛІВИЙ ПРОФІЛЬ: лягає на лівий кант (X = -totalW/2).
      // Повертаємо на 90 градусів вздовж Z, але скейлимо ДОВЖИНУ завжди по X!
      if (this.pool.profile['left']) {
        this.pool.profile['left'].position.set(-totalW / 2, profY, 0)
        this.pool.profile['left'].rotation.set(0, -Math.PI / 2, 0) // розвертаємо вглиб сцени
        this.pool.profile['left'].scale.set(profLongLen / baseProfL, 1, 1) // МАСШТАБУЄМО ДОВЖИНУ ПО X
        this.pool.profile['left'].visible = true
      }
      // ПРАВИЙ ПРОФІЛЬ: лягає на правий кант (X = totalW/2)
      if (this.pool.profile['right']) {
        this.pool.profile['right'].position.set(totalW / 2, profY, 0)
        this.pool.profile['right'].rotation.set(0, Math.PI / 2, 0) // розвертаємо вглиб сцени
        this.pool.profile['right'].scale.set(profLongLen / baseProfL, 1, 1) // МАСШТАБУЄМО ДОВЖИНУ ПО X
        this.pool.profile['right'].visible = true
      }
    }
  }
}
