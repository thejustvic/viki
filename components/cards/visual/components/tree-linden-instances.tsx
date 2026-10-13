/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {useGLTF} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {useEffect, useMemo, useRef, useState} from 'react'
import {
  BufferGeometry,
  Euler,
  InstancedMesh,
  Material,
  Matrix4,
  Quaternion,
  Vector3,
  type Mesh,
  type MeshStandardMaterial
} from 'three'
import type {GLTF} from 'three-stdlib'
import {
  generateNonOverlappingPoints,
  Point,
  type PositionType
} from '../ui/tulip'

type GLTFResult = GLTF & {
  nodes: {
    tree001_Material_0: Mesh
    // Динамічний шаблон для всіх 800 площин
    [key: `Plane${string}_Material001_0`]: Mesh
  }
  materials: {
    Material: MeshStandardMaterial
    ['Material.001']: MeshStandardMaterial
  }
}

const calcTreePositions = (newData: Point[]) => {
  const positions: PositionType[] = []

  newData.forEach(point => {
    positions.push([point.x, 0, point.z])
  })
  return positions
}

export const TreeLindenInstances = () => {
  const {nodes, materials} = useGLTF(
    '/tree_linden.glb'
  ) as unknown as GLTFResult

  const [positions, setPositions] = useState<PositionType[]>()

  useEffect(() => {
    const newData = generateNonOverlappingPoints({
      numberOfItems: 20,
      fieldRadius: 40,
      minRequiredDistance: 5
    })
    setPositions(calcTreePositions(newData))
  }, [])

  const leafData = useMemo(() => {
    return {
      geometry: nodes.Plane001_Material001_0.geometry,
      material: materials['Material.001']
    }
  }, [nodes, materials])

  return (
    <>
      {positions?.map((position, index) => {
        return (
          <TreeLindenModel
            key={index}
            position={position}
            materials={materials}
            leafData={leafData} // дані для нашого інстанс-мешу
            gltfNodes={nodes} // оригінальний GLTFResult
          />
        )
      })}
    </>
  )
}

interface TreeProps {
  position: [number, number, number]
  materials: any
  leafData: {geometry: BufferGeometry; material: Material}
  gltfNodes: any // Оригінальні дані для зчитування координат з Blender
}

export const TreeLindenModel = ({
  position,
  materials,
  leafData,
  gltfNodes
}: TreeProps) => {
  const leavesRef = useRef<InstancedMesh>(null)

  // Збираємо ключі всіх 800 площин
  const branchKeys = useMemo(() => {
    return Object.keys(gltfNodes).filter(key => key.startsWith('Plane'))
  }, [gltfNodes])

  {
    /**
    • Хочете розліт у радіусі 1–2 метрів: поставте MAX_DISTANCE_FORCE = 3, а AIR_RESISTANCE = 0.92.
    • Хочете розліт у радіусі 5–8 метрів: поставте MAX_DISTANCE_FORCE = 10, а AIR_RESISTANCE = 0.98.
    */
  }
  // --- НАЛАШТУВАННЯ ДАЛЬНОСТІ РОЗЛІТАННЯ ---
  const MIN_DISTANCE_FORCE = 3 // Мінімальна дальність (початкова швидкість)
  const MAX_DISTANCE_FORCE = 10 // Максимальна дальність (початкова швидкість)
  const AIR_RESISTANCE = 0.98 // Опір повітря (0.90 — впаде під дерево, 0.99 — полетить дуже далеко)

  // Створюємо масив фізичних даних для кожної гілки
  const physicsData = useMemo(() => {
    return branchKeys.map(() => {
      // Створюємо випадковий кут розлітання (360 градусів)
      const angle = Math.random() * Math.PI * 2
      // сила початкового поштовху вбік
      const force =
        MIN_DISTANCE_FORCE +
        Math.random() * (MAX_DISTANCE_FORCE - MIN_DISTANCE_FORCE)

      return {
        yVelocity: 0, // Початкова вертикальна швидкість
        xVelocity: Math.cos(angle) * force, // Швидкість розлітання по X
        zVelocity: Math.sin(angle) * force, // Швидкість розлітання по Z
        rotVelocity: (Math.random() - 0.5) * 5, // Швидкість обертання в повітрі (швидша)
        delay: 2 + Math.random() * 3, // Затримка перед опаданням (2-5 сек)
        isFalling: false // Статус падіння
      }
    })
  }, [branchKeys])

  // Допоміжні об'єкти (щоб не створювати нові в useFrame)
  const tempMatrix = useMemo(() => new Matrix4(), [])
  const tempPosition = useMemo(() => new Vector3(), [])
  const tempRotation = useMemo(() => new Quaternion(), [])
  const tempScale = useMemo(() => new Vector3(), [])

  const targetRotation = useMemo(() => {
    return new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0))
  }, [])

  useEffect(() => {
    if (!leavesRef.current) {
      return
    }

    branchKeys.forEach((key, index) => {
      const originalMesh = gltfNodes[key]
      if (originalMesh) {
        // Складаємо матрицю на основі позиції, повороту та скейлу з Blender
        tempMatrix.compose(
          originalMesh.position,
          originalMesh.quaternion,
          originalMesh.scale
        )
        // Записуємо матрицю для конкретної гілки за її індексом (0-799)
        leavesRef.current!.setMatrixAt(index, tempMatrix)
      }
    })

    // Повідомляємо Three.js, що матриця оновилася
    leavesRef.current.instanceMatrix.needsUpdate = true
  }, [branchKeys, gltfNodes])

  // 2. АНІМАЦІЙНИЙ ЦИКЛ ПАДІННЯ (60 FPS)
  useFrame((state, delta) => {
    if (!leavesRef.current) {
      return
    }

    const elapsedTime = state.clock.getElapsedTime()
    let hasUpdates = false

    branchKeys.forEach((_, index) => {
      const data = physicsData[index]

      // Перевіряємо, чи настав час падати для цієї гілочки
      if (!data.isFalling && elapsedTime > data.delay) {
        data.isFalling = true
      }

      if (data.isFalling) {
        // Зчитуємо поточну матрицю інстансу
        leavesRef.current!.getMatrixAt(index, tempMatrix)
        tempMatrix.decompose(tempPosition, tempRotation, tempScale)

        // Абсолютна земля — це, наприклад, висота 0 на вашій карті.
        // Оскільки інстанс листя лежить всередині <group position={position}>,
        // для нього нульовий рівень сцени буде дорівнювати мінус висоті дерева (мінус Y координата дерева).
        const absoluteGroundY = -position[1] + 5 // [1] — це координата Y вашого дерева на карті

        if (tempPosition.y > absoluteGroundY) {
          // 1. ГРАВІТАЦІЯ (рух вниз по Y)
          data.yVelocity += 9.8 * delta * 0.5 // 0.5 — коефіцієнт уповільнення для повітря
          tempPosition.y -= data.yVelocity * delta

          // 2. РОЗЛІТАННЯ ВБІК (рух по X та Z)
          tempPosition.x += data.xVelocity * delta
          tempPosition.z += data.zVelocity * delta

          // Опір повітря: зменшуємо горизонтальну швидкість кожного кадру на пару відсотків
          // Завдяки цьому листя пролетить 2-4 метри і почне падати майже вертикально
          data.xVelocity *= Math.pow(AIR_RESISTANCE, delta * 60)
          data.zVelocity *= Math.pow(AIR_RESISTANCE, delta * 60)

          // 🌪️ Ефект погойдування вітром (синусоїда + обертання)
          tempPosition.x += Math.sin(elapsedTime * 5 + index) * delta * 0.5

          // Крутимо гілочку в повітрі
          const deltaRotation = new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0).normalize(),
            data.rotVelocity * delta
          )
          tempRotation.multiply(deltaRotation)

          // 🌟 2. ПЛАВНИЙ ПОВОРОТ ДО ЗЕМЛІ [-Math.PI / 2, 0, 0]
          // Створюємо ефект похитування за допомогою синусоїди
          const wobbleAngle = Math.sin(elapsedTime * 10 + index) * 0.2
          const currentTarget = targetRotation.clone()

          // Додаємо легке коливання в повітрі до цільового кута
          currentTarget.multiply(
            new Quaternion().setFromEuler(new Euler(0, wobbleAngle, 0))
          )

          // Плавно інтерполюємо (slerp) поточний поворот до цільового.
          // Передаємо швидкість інтерполяції (наприклад, delta * 2, де 2 — швидкість вирівнювання)
          tempRotation.slerp(currentTarget, delta * 2)

          hasUpdates = true
        } else {
          // Якщо впала на землю — зупиняємо її рух точечно
          tempPosition.y = absoluteGroundY
          data.xVelocity = 0
          data.zVelocity = 0

          // Коли торкнулося землі — фіксуємо ідеально рівно [-Math.PI / 2, 0, 0]
          tempRotation.copy(targetRotation)
        }

        // Записуємо змінені координати назад в матрицю
        tempMatrix.compose(tempPosition, tempRotation, tempScale)
        leavesRef.current!.setMatrixAt(index, tempMatrix)
      }
    })

    // Оновлюємо матрицю в WebGL тільки якщо щось рухалось
    if (hasUpdates) {
      leavesRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group dispose={null}>
      {/* Головна група дерева на карті */}
      <group position={position}>
        {/* Стовбур рендеримо як звичайний mesh (він один, фпс не просяде) */}
        <mesh
          geometry={gltfNodes.tree001_Material_0.geometry}
          material={materials.Material}
          rotation={[-Math.PI / 2, 0, -1.109]}
          castShadow
          receiveShadow
        />

        {/*
          ЧИСТИЙ INSTANCED MESH НА 800 ОБ'ЄКТІВ:
          Він з'їдає ВСЬОГО 1 draw call на все дерево і працює супер-швидко!
        */}
        <instancedMesh
          ref={leavesRef}
          args={[leafData.geometry, leafData.material, branchKeys.length]} // [геометрія, матеріал, 800]
          castShadow
          receiveShadow
        />
      </group>
    </group>
  )
}
