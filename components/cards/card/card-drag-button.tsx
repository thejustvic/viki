import tw from '@/components/common/tw-styled-components'
import {Button} from '@/components/daisyui/button'
import {DraggableAttributes} from '@dnd-kit/core'
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {IconDragDrop2} from '@tabler/icons-react'

interface ITwTooltip {
  $isVisible: boolean
}
const TwTooltip = tw.div<ITwTooltip>`
  ${({$isVisible}) => $isVisible && 'tooltip tooltip-top tooltip-info'}
`

const TwTooltipContent = tw.p`
  tooltip-content
  px-[4px]
  py-px
  text-[11px]
  text-info-content/90
`

interface ITwDragButton {
  $isVisible: boolean
  $isDragging: boolean | undefined
}
const TwDragButton = tw(Button)<ITwDragButton>`
  ${({$isVisible}) => ($isVisible ? 'opacity-100' : 'opacity-0')}
  ${({$isDragging}) => $isDragging && 'cursor-grabbing'}
  self-start
`

interface CardDragButtonProps {
  dragAttributes?: DraggableAttributes
  dragListeners: SyntheticListenerMap | undefined
  isVisible?: boolean
  isDragging?: boolean
}
export const CardDragButton = ({
  dragAttributes,
  dragListeners,
  isVisible = true,
  isDragging
}: CardDragButtonProps) => {
  return (
    <TwTooltip $isVisible={!isDragging && isVisible}>
      {!isDragging && isVisible && (
        <TwTooltipContent>drag to sort</TwTooltipContent>
      )}
      <TwDragButton
        {...dragAttributes}
        {...dragListeners}
        soft
        size="sm"
        shape="circle"
        $isVisible={isVisible}
        $isDragging={isDragging}
      >
        <IconDragDrop2 size={16} />
      </TwDragButton>
    </TwTooltip>
  )
}
