import {useGlobalStore} from '@/components/global-provider/global-store'
import {BooleanHookState, useBoolean} from '@/hooks/use-boolean'
import {
  maxWidthLeftDrawer,
  maxWidthRightDrawer,
  minDrawerWidth,
  minNavbarWidth
} from '@/utils/const'
import {useCallback, useEffect, useRef} from 'react'

interface Handlers {
  handleMouseDown: (event: React.MouseEvent) => void
  mouseDown: BooleanHookState
}

interface DragHandlersProps {
  drawer: 'left' | 'right'
}

export const useDragDrawerSideHandlers = ({
  drawer
}: DragHandlersProps): Handlers => {
  const mouseDown = useBoolean(false)
  const [state, store] = useGlobalStore()
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  const handleMouseDown = useCallback(
    (event: React.MouseEvent): void => {
      const currentWidth =
        drawer === 'left' ? state.leftDrawerWidth : state.rightDrawerWidth
      startXRef.current = event.screenX
      startWidthRef.current = currentWidth

      mouseDown.turnOn()
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
    },
    [drawer, state.leftDrawerWidth, state.rightDrawerWidth, mouseDown]
  )

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!mouseDown.value) {
        return
      }

      const delta = startXRef.current - event.screenX
      const navbarWidth = Number(state.navbarWidth)

      if (drawer === 'left') {
        // if the drawer size increases and the navigation bar reaches minNavbarWidth pixels, the increase should be stopped
        if (delta < 0 && navbarWidth <= minNavbarWidth) {
          return
        }
        const newWidth = startWidthRef.current - delta
        if (newWidth >= minDrawerWidth && newWidth <= maxWidthLeftDrawer) {
          store.setLeftDrawerWidth(newWidth)
        }
      } else {
        // if the drawer size increases and the navigation bar reaches minNavbarWidth pixels, the increase should be stopped
        if (delta > 0 && navbarWidth <= minNavbarWidth) {
          return
        }
        const newWidth = startWidthRef.current + delta
        if (newWidth >= minDrawerWidth && newWidth <= maxWidthRightDrawer) {
          store.setRightDrawerWidth(newWidth)
        }
      }
    },
    [mouseDown.value, drawer, state.navbarWidth, store]
  )

  const handleMouseUp = useCallback((): void => {
    mouseDown.turnOff()
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [mouseDown])

  useEffect(() => {
    if (mouseDown.value) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [mouseDown.value, handleMouseMove, handleMouseUp])

  return {
    handleMouseDown,
    mouseDown
  }
}
