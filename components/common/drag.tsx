'use client'

import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import tw from 'tailwind-styled-components'
import {useGlobalStore} from '../global/global-store'
import {useDragHandlers} from './drag-handlers'

export interface DragProps {
  drawer: 'left' | 'right'
}

export const Drag = observer(({drawer}: DragProps) => {
  const [, store] = useGlobalStore()
  const {handleMouseDown, handleMouseUp, handleMouseMove, mouseDown, mouseX} =
    useDragHandlers({drawer})

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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
