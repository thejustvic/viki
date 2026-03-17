import tw from '@/components/common/tw-styled-components'
import {DraggableAttributes} from '@dnd-kit/core'
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {isMobile} from 'react-device-detect'
import {CardDeleteButton} from './card-delete-button'
import {CardDragButton} from './card-drag-button'

const TwWrapper = tw.div`
  flex
  gap-1
  self-start
`

interface CardActionButtonsProps {
  isDragging?: boolean
  hovered?: boolean
  remove: () => void
  dragListeners: SyntheticListenerMap | undefined
  dragAttributes?: DraggableAttributes
}
export const CardActionButtons = ({
  isDragging,
  dragListeners,
  dragAttributes,
  remove,
  hovered
}: CardActionButtonsProps) => {
  const isVisible = isMobile ? true : hovered
  return (
    <TwWrapper>
      <CardDragButton
        isDragging={isDragging}
        dragListeners={dragListeners}
        dragAttributes={dragAttributes}
        isVisible={isVisible}
      />
      <CardDeleteButton remove={remove} isVisible={isVisible} />
    </TwWrapper>
  )
}
