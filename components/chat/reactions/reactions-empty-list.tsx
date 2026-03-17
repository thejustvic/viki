import {ReactionsDropdownContent} from '@/components/chat/reactions/reactions-dropdown-content'
import {Message} from '@/components/chat/types'
import tw from '@/components/common/tw-styled-components'
import {Dropdown} from '@/components/daisyui/dropdown'
import {BooleanHookState} from '@/hooks/use-boolean'
import {IconMoodSmileFilled} from '@tabler/icons-react'
import {isMobile} from 'react-device-detect'

const TwIconReactionAbsoluteContainer = tw.div`
  absolute
  bottom-4
  -left-2
  cursor-pointer
  text-info/80
`

const TwIconReactionAbsolute = tw.div`
  absolute
`

interface ITwWrapper {
  $isVisible: boolean
  $isMy: boolean
}
const TwWrapper = tw.div<ITwWrapper>`
  ${({$isVisible}) => ($isVisible ? 'block' : 'hidden')}
  ${({$isMy}) => ($isMy ? 'right-0' : 'left-0')}
  absolute
  -top-3
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
    <TwWrapper $isVisible={showChoice.value} $isMy={my}>
      <ReactionsDropdownContent
        message={message}
        showChoice={showChoice}
        noSmilesInMessage
      />
    </TwWrapper>
  )
}

interface ITwDropdown {
  $isMouseOver: boolean
  $isVisible: boolean
}
const TwDropdown = tw(Dropdown)<ITwDropdown>`
  ${({$isMouseOver}) => ($isMouseOver ? 'opacity-100' : 'opacity-0')}
  ${({$isVisible}) => $isVisible && 'dropdown-open'}
  absolute
  bottom-0
  left-0
  hover:opacity-100
  transition-opacity
  ease-in-out
  duration-150
`

const TwDropdownMenu = tw(Dropdown.Menu)`
  -top-6
  -left-4
`

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
    <TwDropdown
      $isVisible={showChoice.value}
      $isMouseOver={isMouseOver}
      onClickOutside={showChoice.turnOff}
    >
      <TwIconReactionAbsoluteContainer>
        <TwIconReactionAbsolute>
          <IconMoodSmileFilled size={24} onClick={showChoice.turnOn} />
        </TwIconReactionAbsolute>
      </TwIconReactionAbsoluteContainer>
      <TwDropdownMenu>
        <ReactionsDropdownContent message={message} showChoice={showChoice} />
      </TwDropdownMenu>
    </TwDropdown>
  )
}
