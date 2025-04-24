import {useBoolean} from '@/hooks/use-boolean'
import {OrbitControls} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import {useRef} from 'react'
import type {Mesh} from 'three/src/objects/Mesh'

interface Props {
  position: [x: number, y: number, z: number]
}

const Box = (props: Props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null)
  // Hold state for hovered and clicked events
  const hovered = useBoolean(false)
  const clicked = useBoolean(false)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta
      ref.current.rotation.y += 0.5 * delta
    }
  })

  // Return the view, these are regular Three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked.value ? 1.5 : 1}
      onClick={clicked.toggle}
      onPointerOver={event => (event.stopPropagation(), hovered.turnOn())}
      onPointerOut={hovered.turnOff}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered.value ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function CardVisual() {
  return (
    <Canvas camera={{position: [0, 0, 3]}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <OrbitControls />
    </Canvas>
  )
}
