import {CanvasTexture} from 'three'

export const createTextTexture = (
  text: string,
  color = '#ffffff',
  bgColor = '#ff0000'
): CanvasTexture => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Could not get canvas context')
  }

  const size = 512
  canvas.width = size
  canvas.height = size

  // Draw background
  context.fillStyle = bgColor
  context.fillRect(0, 0, size, size)

  // Draw the text
  context.fillStyle = color
  context.font = '16px Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  context.fillText(text, size / 4, size / 2)

  // console.log(canvas.toDataURL()) // Uncomment this to see the generated image in your browser console

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true

  return texture
}
