import {ReactionsDropdownContent} from '@/components/chat/reactions/reactions-dropdown-content'
import {Message} from '@/components/chat/types'
import {Dropdown} from '@/components/daisyui/dropdown'
import {BooleanHookState} from '@/hooks/use-boolean'
import {IconMoodSmileFilled} from '@tabler/icons-react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'

const TwIconReactionAbsoluteContainer = tw.div`
  absolute
  bottom-4
  -left-2
  cursor-pointer
`

const TwIconReactionAbsolute = tw.div`
  absolute
`

interface EmptyReactionsProps {
  message: Message
  showChoice: BooleanHookState
  isMouseOver: boolean
}

export const ReactionsEmptyList = ({
  message,
  showChoice,
  isMouseOver
}: EmptyReactionsProps) => {
  return (
    <Dropdown
      onClickOutside={showChoice.turnOff}
      hover={!isMobile}
      className={twJoin(
        isMouseOver && 'opacity-100',
        showChoice.value && 'dropdown-open',
        `absolute bottom-0 left-0   opacity-0 
  hover:opacity-100 
  transition-opacity 
  ease-in-out 
  duration-150`
      )}
    >
      <TwIconReactionAbsoluteContainer
        tabIndex={isMobile ? 0 : undefined}
        role={isMobile ? 'button' : ''}
      >
        <TwIconReactionAbsolute>
          <IconMoodSmileFilled size={24} />
        </TwIconReactionAbsolute>
      </TwIconReactionAbsoluteContainer>
      <Dropdown.Menu
        className="-top-6 -left-4"
        tabIndex={isMobile ? 0 : undefined}
      >
        <ReactionsDropdownContent message={message} showChoice={showChoice} />
      </Dropdown.Menu>
    </Dropdown>
  )
}
