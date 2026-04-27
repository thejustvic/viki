/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import {useGLTF} from '@react-three/drei'
import {useFrame, useGraph} from '@react-three/fiber'
import {useEffect, useMemo, useRef} from 'react'
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial
} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'

const JELLYFISH_RENDER_ORDER = 10 // the higher the number, the later the object is drawn (on top of others)

type GLTFResult = GLTF & {
  nodes: {
    Cylinder002_Jellyfish3_0: Mesh
    BezierCurve002_Jellyfish3_0: Mesh
  }
  materials: {
    Jellyfish3: MeshStandardMaterial
  }
}

interface JellyfishModelProps {
  offset?: number
  scale?: number
  text: string
  color: string
}

export const JellyfishModel = ({
  offset = 0,
  scale = 0.01,
  text,
  color
}: JellyfishModelProps) => {
  const group = useRef<Group>(null)
  const pivotRef = useRef<Group>(null)
  const {scene} = useGLTF('/jellyfish.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult

  const jellyfishMaterial = useMemo(() => {
    const m = materials.Jellyfish3.clone()

    m.color = new Color('#000000') // black base color to ONLY glow emissive

    m.emissive = new Color(color)
    m.transparent = true
    m.blending = AdditiveBlending // the color will layer and glow
    m.side = DoubleSide // both the inner and outer walls will glow

    return m
  }, [materials, color])

  useFrame(state => {
    const t = state.clock.getElapsedTime() + offset

    // rotation of the entire jellyfish
    if (group.current) {
      // slow constant rotation around the Y axis
      group.current.rotation.y = t * 0.2

      // slight rocking (sideways tilts)
      group.current.rotation.x = Math.cos(t * 0.5) * 0.1
      group.current.rotation.z = Math.sin(t * 0.5) * 0.1

      // UP-DOWN swing
      // t * 1.5 — speed must match the speed of the tentacles
      // 0.5 — amplitude (how high it floats)
      group.current.position.y = Math.sin(t * 1.5) * 0.5
    }
    // tentacle animation
    if (pivotRef.current) {
      // determining the compression/stretching force
      // use Math.sin without abs to get both compression and stretching
      const wave = Math.sin(t * 1.5) * 0.2

      // vertical scaling (Y)
      // when wave is negative, the tentacles shorten.
      pivotRef.current.scale.y = 1 + wave

      // horizontal scaling (X and Z)
      // use MINUS wave:
      // if Y decreases (1 - 0.2 = 0.8), then X/Z increases (1 - (-0.2) = 1.2)
      const thickness = 1 - wave

      pivotRef.current.scale.x = thickness
      pivotRef.current.scale.z = thickness
    }

    // luminescence pulsation
    if (jellyfishMaterial) {
      jellyfishMaterial.opacity = 0.1 + Math.abs(Math.sin(t * 1.5)) * 0.1
    }
  })

  return (
    <group ref={group} dispose={null} scale={scale}>
      <mesh
        renderOrder={JELLYFISH_RENDER_ORDER}
        geometry={nodes.Cylinder002_Jellyfish3_0.geometry}
        material={jellyfishMaterial}
        position={[0, 123.354, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[62.143, 62.143, 74.045]}
      />
      <group
        ref={pivotRef}
        position={[0, 0, 0]} // point where growth begins (top of tentacles)
      >
        <mesh
          renderOrder={JELLYFISH_RENDER_ORDER}
          geometry={nodes.BezierCurve002_Jellyfish3_0.geometry}
          material={jellyfishMaterial}
          /*
            IMPORTANT: add position.y to shift the mesh down to stretch the tentacles only downwards
          */
          position={[0, -25, 0]}
          scale={[100, 119.153, 100]}
        />
      </group>
      <TextRibbon
        position={[10, -120, 30]} // attached to one of the jellyfish's legs
        text={text}
        color={color}
      />
    </group>
  )
}

interface TextRibbonProps {
  text: string
  color: string
  position: [number, number, number]
}
export const TextRibbon = ({text, color, position}: TextRibbonProps) => {
  const {texture, aspectRatio} = useTextTexture(text, color)
  const materialRef = useRef<ShaderMaterial>(null)
  const meshRef = useRef<Mesh>(null)

  const ribbonHeight = 20
  const totalLength = useMemo(
    () => ribbonHeight * Number(aspectRatio),
    [aspectRatio]
  )

  // updating the ribbon in the shader when color changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTexture.value = texture
      materialRef.current.uniforms.uTotalLength.value = totalLength
    }
  }, [color, texture, totalLength])

  useFrame(({clock}) => {
    const t = clock.getElapsedTime()
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t
    }
    if (meshRef.current) {
      // rotation in the opposite direction of the jellyfish's rotation for a static effect
      meshRef.current.rotation.y = -(t * 0.2)

      // determining the compression/stretching force
      // use Math.sin without abs to get both compression and stretching
      const wave = Math.sin(t * 1.5) * 0.09

      // vertical scaling (Y)
      // when wave is negative, the tentacles shorten.
      meshRef.current.scale.y = 1 + wave

      // horizontal scaling (X and Z)
      // use MINUS wave:
      // if Y decreases (1 - 0.2 = 0.8), then X/Z increases (1 - (-0.2) = 1.2)
      const thickness = 1 - wave

      meshRef.current.scale.x = thickness
      meshRef.current.scale.z = thickness
    }
  })

  return (
    <mesh key={totalLength} ref={meshRef} position={position}>
      <planeGeometry args={[totalLength, ribbonHeight, 128, 32]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        side={DoubleSide}
        uniforms={{
          uTime: {value: 0},
          uTexture: {value: texture},
          uBgColor: {value: new Color('#1b7a5b')},
          uTotalLength: {value: totalLength}
        }}
        vertexShader={`
          varying vec2 vUv;
          varying float vCirclePortion;
          uniform float uTotalLength;
          uniform float uTime;

          void main() {
            vUv = uv;
            vec3 newPos = position;

            float radius = 5.0;
            float circleLength = 6.28318 * radius;

            // calculation of the ring's fraction from the total length
            float circlePortion = circleLength / uTotalLength;
            circlePortion = clamp(circlePortion, 0.1, 0.5);
            vCirclePortion = circlePortion;

            if (vUv.x < circlePortion) {

              // Ring Logic
              float angle = (vUv.x / circlePortion) * 6.28318;
              newPos.x = sin(angle) * radius;
              newPos.z = cos(angle) * radius - radius;
            } else {

              // Tail Logic
              float normalizedX = (vUv.x - circlePortion) / (1.0 - circlePortion);
              float tailLength = uTotalLength - (circlePortion * uTotalLength);

              newPos.x = normalizedX * tailLength;
              newPos.z = 0.0;

              float speed = uTime * 2.0;

              // use newPos.x to calculate the wave.
              // this will make the waves stable relative to the length of the tape.
              float waveFreq = 0.1; // adjust the frequency (number of bends)
              float waveIndex = newPos.x * waveFreq;

              newPos.y += sin(waveIndex - speed) * 2.0;
              newPos.z += cos(waveIndex - speed) * 2.0;

            }

            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform vec3 uBgColor;
          varying vec2 vUv;
          varying float vCirclePortion;

          void main() {
            if (vUv.x < vCirclePortion) {

              // draw only the background on the ring
              gl_FragColor = vec4(uBgColor, 1.0);
            } else {
                if (gl_FrontFacing) {

                  // draw text on the tail
                  // recalculate the UV so that the text takes only the tail
                  float tailX = (vUv.x - vCirclePortion) / (1.0 - vCirclePortion);
                  vec4 texColor = texture2D(uTexture, vec2(tailX, vUv.y));

                  vec3 finalColor = mix(uBgColor, texColor.rgb, texColor.a);
                  gl_FragColor = vec4(finalColor, 1.0);
                } else {

                  // the reverse side is just a plain background color with no text
                  gl_FragColor = vec4(uBgColor, 1.0);
                }
            }
          }
        `}
      />
    </mesh>
  )
}

const useTextTexture = (text: string, color: string) => {
  const canvas = useMemo(() => document.createElement('canvas'), [])

  // use a separate useRef for the texture so as not to recreate the object
  const textureRef = useRef<CanvasTexture | null>(null)

  const {texture, aspectRatio} = useMemo(() => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return {texture: null, aspectRatio: 1}
    }

    ctx.font = 'Bold 80px Arial'
    const textMetrics = ctx.measureText(text)
    const padding = 500

    // updating canvas dimensions
    canvas.width = textMetrics.width + padding
    canvas.height = 128

    // draw new text and color
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = 'Bold 80px Arial'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    // TEXTURE UPDATE
    if (!textureRef.current) {
      textureRef.current = new CanvasTexture(canvas)
    } else {
      // this flag forces Three.js to load the new canvas state to the GPU
      textureRef.current.needsUpdate = true
    }

    return {
      texture: textureRef.current,
      aspectRatio: canvas.width / canvas.height
    }
  }, [text, color, canvas])

  return {texture, aspectRatio}
}
