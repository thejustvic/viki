import {useGlobalStore} from '@/components/global-provider/global-store'
import {BooleanHookState, useBoolean} from '@/hooks/use-boolean'
import {useCallback, useState} from 'react'
import {DragProps} from './drag-drawer-side'

interface Handlers {
  handleMouseDown: (event: React.MouseEvent) => void
  handleMouseUp: () => void
  handleMouseMove: (event: MouseEvent) => void
  mouseDown: BooleanHookState
  mouseX: {
    start: number
    move: number
    startWidth: number
  }
}

export const useDragDrawerSideHandlers = ({drawer}: DragProps): Handlers => {
  const mouseDown = useBoolean(false)
  const [state] = useGlobalStore()
  const [mouseX, setMouseX] = useState({
    start: 0,
    move: 0,
    startWidth: state.rightDrawerWidth
  })

  const getDrawerWidth = (): number => {
    return drawer === 'left' ? state.leftDrawerWidth : state.rightDrawerWidth
  }

  const handleMouseDown = (event: React.MouseEvent): void => {
    mouseDown.turnOn()
    setMouseX({
      start: event.screenX,
      move: 0,
      startWidth: getDrawerWidth()
    })

    const body = document.getElementsByTagName('body')[0]
    body.style.userSelect = 'none'
    body.style.cursor = 'col-resize'
  }

  const handleMouseUp = (): void => {
    if (!mouseDown.value) {
      return
    }
    mouseDown.turnOff()
    setMouseX({start: 0, move: 0, startWidth: getDrawerWidth()})

    const body = document.getElementsByTagName('body')[0]
    body.style.userSelect = 'auto'
    body.style.cursor = 'auto'
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!mouseDown.value) {
        return
      }
      switch (drawer) {
        case 'left':
          return setMouseX(prev => ({
            ...prev,
            move: mouseX.start - event.screenX
          }))
        case 'right':
          return setMouseX(prev => ({
            ...prev,
            move: mouseX.start - event.screenX
          }))
        default:
          return
      }
    },
    [mouseDown.value]
  )

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    mouseDown,
    mouseX
  }
}
