'use client'

import {useGlobalStore} from '@/components/global/global-store'
import {useBoolean} from '@/hooks/use-boolean'
import {observer} from 'mobx-react-lite'
import {useCallback, useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'

interface Props {
  drawer: 'left' | 'right'
}

// eslint-disable-next-line max-lines-per-function
export const Drag = observer(({drawer}: Props) => {
  const mouseDown = useBoolean(false)
  const [state, store] = useGlobalStore()
  const [mouseX, setMouseX] = useState({
    start: 0,
    move: 0,
    startWidth: state.rightDrawerWidth
  })

  const getDrawerWidth = () => {
    return drawer === 'left' ? state.leftDrawerWidth : state.rightDrawerWidth
  }

  useEffect(() => {
    if (!mouseDown.value) {
      return
    }
    switch (drawer) {
      case 'left': {
        const widthLeft = mouseX.startWidth - mouseX.move
        if (widthLeft > 320 && widthLeft < 640) {
          return store.setLeftDrawerWidth(widthLeft)
        }
        break
      }
      case 'right': {
        const widthRight = mouseX.startWidth + mouseX.move
        if (widthRight > 320 && widthRight < 640) {
          return store.setRightDrawerWidth(widthRight)
        }
        break
      }
      default:
        break
    }
  }, [mouseX.move])

  const handleMouseDown = (event: React.MouseEvent) => {
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

  const handleMouseUp = () => {
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

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <TwDragWrap
      onMouseDown={handleMouseDown}
      $show={mouseDown.value}
      $right={drawer === 'left'}
    >
      <DragSvg />
    </TwDragWrap>
  )
})

const TwDragWrap = tw.div<{$show: boolean; $right: boolean}>`
  absolute
  h-full
  p-0
  pr-2
  w-1
  z-10
  group
  cursor-col-resize
  opacity-0
  hover:opacity-100
  transition-opacity
  ease-in-out
  delay-150
  duration-200
  ${p => p.$show && 'opacity-100'}
  ${p => (p.$right ? 'right-0' : 'left-0')}
`

const DragSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={`h-2.5 w-2.5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
    >
      <circle cx="9" cy="12" r="1"></circle>
      <circle cx="9" cy="5" r="1"></circle>
      <circle cx="9" cy="19" r="1"></circle>
      <circle cx="15" cy="12" r="1"></circle>
      <circle cx="15" cy="5" r="1"></circle>
      <circle cx="15" cy="19" r="1"></circle>
    </svg>
  )
}
