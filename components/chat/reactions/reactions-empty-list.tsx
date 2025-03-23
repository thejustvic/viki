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

interface MobileReactionsDropdownContentProps {
  message: Message
  showChoice: BooleanHookState
  my: boolean
}

export const MobileReactionsDropdownContent = ({
  my,
  message,
  showChoice
}: MobileReactionsDropdownContentProps) => {
  return (
    <div
      className={twJoin(
        showChoice.value ? 'block' : 'hidden',
        my ? 'right-0' : 'left-0',
        'absolute -top-3'
      )}
    >
      <ReactionsDropdownContent
        message={message}
        showChoice={showChoice}
        noSmilesInMessage
      />
    </div>
  )
}

interface EmptyReactionsProps {
  message: Message
  showChoice: BooleanHookState
  isMouseOver: boolean
  my: boolean
}

export const ReactionsEmptyList = ({
  my,
  message,
  showChoice,
  isMouseOver
}: EmptyReactionsProps) => {
  if (isMobile) {
    return (
      <MobileReactionsDropdownContent
        my={my}
        message={message}
        showChoice={showChoice}
      />
    )
  }

  return (
    <Dropdown
      onClickOutside={showChoice.turnOff}
      hover
      className={twJoin(
        isMouseOver && 'opacity-100',
        showChoice.value && 'dropdown-open',
        ` absolute 
          bottom-0 
          left-0
          opacity-0 
          hover:opacity-100 
          transition-opacity 
          ease-in-out 
          duration-150
        `
      )}
    >
      <TwIconReactionAbsoluteContainer>
        <TwIconReactionAbsolute>
          <IconMoodSmileFilled size={24} />
        </TwIconReactionAbsolute>
      </TwIconReactionAbsoluteContainer>
      <Dropdown.Menu className="-top-6 -left-4">
        <ReactionsDropdownContent message={message} showChoice={showChoice} />
      </Dropdown.Menu>
    </Dropdown>
  )
}
