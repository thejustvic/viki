import {useBoolean} from '@/hooks/use-boolean'
import {OrbitControls} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import {useRef} from 'react'
import type {Mesh} from 'three/src/objects/Mesh'

interface Props {
  position: [x: number, y: number, z: number]
  head?: boolean
}

const Box = ({position, head = false}: Props) => {
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
      position={position}
      ref={ref}
      scale={clicked.value ? 1.5 : 1}
      onClick={clicked.toggle}
      onPointerOver={event => (event.stopPropagation(), hovered.turnOn())}
      onPointerOut={hovered.turnOff}
    >
      <boxGeometry args={head ? [1.7, 1.7, 1.7] : [1, 1, 1]} />
      <meshStandardMaterial color={hovered.value ? 'hotpink' : 'green'} />
    </mesh>
  )
}

export default function CardVisual() {
  return (
    <Canvas camera={{position: [15, 0, 10]}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      //head
      <Box position={[0, 5, 0.5]} head />
      <Box position={[0.5, 5, 0]} head />
      <Box position={[0, 4, 0.5]} head />
      <Box position={[0.5, 4, 0]} head />
      //tors
      <Box position={[0, 4, 0]} />
      <Box position={[0, 3, 0]} />
      <Box position={[0, 2, 0]} />
      <Box position={[0, 1, 0]} />
      <Box position={[0, 0, 0]} />
      <Box position={[0, -1, 0]} />
      <Box position={[0, -2, 0]} />
      //right hand
      <Box position={[1, 1, 0]} />
      <Box position={[2, 1, 0]} />
      //left hand
      <Box position={[0, 1, 1]} />
      <Box position={[0, 1, 2]} />
      // right foot
      <Box position={[0.5, -2.5, 0]} />
      <Box position={[1, -3, 0]} />
      <Box position={[1.5, -3.5, 0]} />
      <Box position={[2, -4, 0]} />
      <Box position={[2.5, -4.5, 0]} />
      //left foot
      <Box position={[0, -2.5, 0.5]} />
      <Box position={[0, -3, 1]} />
      <Box position={[0, -3.5, 1.5]} />
      <Box position={[0, -4, 2]} />
      <Box position={[0, -4.5, 2.5]} />
      // able to rotate
      <OrbitControls />
    </Canvas>
  )
}
