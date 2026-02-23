import {CanvasTexture, LinearFilter} from 'three'

export const createTextTexture = ({
  text,
  color = '#000000',
  bgColor = '#ffffff'
}: {
  text: string
  color?: string
  bgColor?: string
}): CanvasTexture => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Could not get canvas context')
  }

  const size = 512
  canvas.width = size
  canvas.height = size

  context.fillStyle = bgColor
  context.fillRect(0, 0, size, size)

  const fontSize = 24
  const padding = 260
  const maxWidth = 160
  const lineHeight = fontSize * 1.4
  const MAX_TEXT_LINES_TO_DISPLAY = 6

  context.fillStyle = color
  context.font = `${fontSize}px Arial`
  context.textBaseline = 'top'
  context.textAlign = 'center'

  const words = text.split(' ')
  let line = ''
  const lines: string[] = []

  let wordIndex: number

  // pass 1: determine line breaks and check for line limit
  for (wordIndex = 0; wordIndex < words.length; wordIndex++) {
    const testLine = line + words[wordIndex] + ' '
    const metrics = context.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && wordIndex > 0) {
      lines.push(line)
      line = words[wordIndex] + ' '

      if (lines.length === MAX_TEXT_LINES_TO_DISPLAY) {
        break
      }
    } else {
      line = testLine
    }
  }

  // push the last line if we haven't hit the max lines yet (using the final value of n)
  if (lines.length < MAX_TEXT_LINES_TO_DISPLAY) {
    lines.push(line)
  }

  // pass 2: draw the text with centering and ellipsis
  const totalTextHeight = lines.length * lineHeight
  const startY = (size - totalTextHeight) / 2 // center vertically

  let currentY = startY
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let drawnLine = lines[lineIndex]

    // check if need to add an ellipsis to the last displayed line
    // check if the original text had more words to process (wordIndex < words.length)
    if (
      lineIndex === MAX_TEXT_LINES_TO_DISPLAY - 1 &&
      wordIndex < words.length
    ) {
      // trim the line we stopped on to make room for "..."
      while (context.measureText(drawnLine + '...').width > maxWidth) {
        drawnLine = drawnLine.substring(0, drawnLine.length - 1).trim()
      }
      drawnLine += '...' // add the ellipsis
    }

    context.fillText(drawnLine, padding, currentY)
    currentY += lineHeight
  }

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.minFilter = LinearFilter

  return texture
}
