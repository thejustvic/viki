import * as THREE from 'three'

export class CanopyPool {
  private mainGroup: THREE.Group
  private templates: Record<string, THREE.Object3D> = {}

  // Флаг, який показує, що всі об'єкти згенеровані та готові до використання в update
  public initialized = false

  // --- МАКСИМАЛЬНІ ЛІМІТИ ПУЛУ (Захист від переповнення пам'яті) ---
  public readonly maxColumns = 8 // Макс. кількість опорних стовпів (з урахуванням центральних)
  public readonly maxCorners = 16 // Макс. кількість укосин (по 2 на кожну колону)
  public readonly maxKrokvu = 70 // Макс. кількість крокв для великих прольотів даху
  public readonly maxRoofBoards = 70 // Макс. кількість дошок вагонки для повного зашиття стелі

  // --- МАСИВИ ТА ОБ'ЄКТИ ДЛЯ ЗБЕРЕЖЕННЯ ЕЛЕМЕНТІВ СЦЕНИ ---
  public columns: THREE.Group[] = []
  public corners: THREE.Group[] = []
  public krokvuB: THREE.Group[] = [] // Головні довгі крокви
  public krokvuA: THREE.Group[] = [] // Короткі виносні кобилки
  public roofBoards: THREE.Group[] = [] // Дошки настилу даху

  // Об'єкти для фіксованих елементів каркаса, де ключ — це сторона навісу
  public beams: Record<string, THREE.Group> = {}
  public frieze: Record<string, THREE.Group> = {}
  public profile: Record<string, THREE.Group> = {}
  public ruberoid: THREE.Group | null = null

  constructor(mainGroup: THREE.Group) {
    this.mainGroup = mainGroup // Головна тривимірна група сцени, куди монтується весь каркас
  }

  /**
   * Ініціалізація пулу. Викликається один раз після успішного завантаження GLB асетів.
   */
  public init(templates: Record<string, THREE.Object3D>) {
    if (this.initialized) {
      return
    }
    this.templates = templates

    // 1. Наповнюємо пул для динамічних елементів: колони та кутові підпори
    for (let i = 0; i < this.maxColumns; i++) {
      this.columns.push(this.createPivotGroup('balk_150x150x2200'))
    }
    for (let i = 0; i < this.maxCorners; i++) {
      this.corners.push(this.createPivotGroup('balk_corner'))

      // 2. Створюємо фіксовані каркасні балки та захисні профілі для 4-х сторін світу
    }
    ;['left', 'right', 'front', 'back'].forEach(side => {
      this.beams[side] = this.createPivotGroup('balk_150x150x1000')
      this.profile[side] = this.createPivotGroup(
        'profile_canopy_perimeter_closed'
      )
    })

    // 3. Формуємо пул для внутрішніх та зовнішніх дошок фриза (усього 8 елементів обв'язки)
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
      this.frieze[key] = this.createPivotGroup('Lodge_20x200x1000')
    })

    // 4. Генеруємо запас елементів для кроквяної системи (бруси B та кобилки A)
    for (let i = 0; i < this.maxKrokvu; i++) {
      this.krokvuB.push(this.createPivotGroup('lodge_150x50x1000'))
      this.krokvuA.push(this.createPivotGroup('lodge_150x50x200'))
    }

    // 5. Заповнюємо пул дошками для настилу стелі
    for (let i = 0; i < this.maxRoofBoards; i++) {
      this.roofBoards.push(this.createPivotGroup('Lodge_20x190x1000_bevel'))
    }

    // 6. Створюємо єдиний об'єкт гідроізоляційного покриття
    this.ruberoid = this.createPivotGroup('ruberoid_1000x1000x2')

    this.initialized = true
  }

  /**
   * Допоміжний метод: створює порожню групу-контейнер (Pivot Point),
   * центрує вихідну модель із Blender всередині неї та додає до сцени.
   * Це дозволяє математично точно обертати та масштабувати об'єкти відносно їхнього геометричного центру.
   */
  private createPivotGroup(templateName: string): THREE.Group {
    const group = new THREE.Group()
    const meta = this.templates[templateName]
    if (!meta) {
      return group
    }

    // Глибоке копіювання мешу
    const model = meta.clone(true)

    // Розрахунок габаритного контейнера для обчислення центру моделі
    const box = new THREE.Box3().setFromObject(model)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // Зсуваємо модель так, щоб її локальний центр опинився в точці (0, 0, 0) Pivot-групи
    model.position.sub(center)

    group.add(model)
    group.visible = false // За замовчуванням об'єкт прихований, доки не спрацює метод update
    this.mainGroup.add(group)
    return group
  }

  /**
   * Скидання сцени: миттєво ховає абсолютно всі об'єкти пулу.
   * Викликається на початку кожного кадру оновлення розмірів (перед запуском математики розкладки).
   */
  public hideAll() {
    this.columns.forEach(m => (m.visible = false))
    this.corners.forEach(m => (m.visible = false))
    this.krokvuB.forEach(m => (m.visible = false))
    this.krokvuA.forEach(m => (m.visible = false))
    this.roofBoards.forEach(m => (m.visible = false))
    Object.values(this.beams).forEach(b => (b.visible = false))
    Object.values(this.frieze).forEach(f => (f.visible = false))
    Object.values(this.profile).forEach(f => (f.visible = false))
    if (this.ruberoid) {
      this.ruberoid.visible = false
    }
  }
}
