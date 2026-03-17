'use client'

import {useDragDrawerSideHandlers} from '@/components/common/drag-drawer-side/drag-drawer-side-handlers'
import {observer} from 'mobx-react-lite'
import tw from '../tw-styled-components'

interface TwDragWrap {
  $isVisible: boolean
  $isRight: boolean
}
const TwDragWrap = tw.div<TwDragWrap>`
  ${({$isVisible}) => $isVisible && 'opacity-100'}
  ${({$isRight}) => ($isRight ? 'right-0' : 'left-0')}
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
`

export interface DragProps {
  drawer: 'left' | 'right'
}
export const DragDrawerSide = observer(({drawer}: DragProps) => {
  const {handleMouseDown, mouseDown} = useDragDrawerSideHandlers({
    drawer
  })

  return (
    <TwDragWrap
      onMouseDown={handleMouseDown}
      $isVisible={mouseDown.value}
      $isRight={drawer === 'left'}
    >
      <DragSvg />
    </TwDragWrap>
  )
})

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
