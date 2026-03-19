import {ReactionsDropdownContent} from '@/components/chat/reactions/reactions-dropdown-content'
import {Message} from '@/components/chat/types'
import tw from '@/components/common/tw-styled-components'
import {Dropdown} from '@/components/daisyui/dropdown'
import {BooleanHookState} from '@/hooks/use-boolean'
import {IconMoodSmile} from '@tabler/icons-react'

interface IIconReaction {
  $isDropdownOpen: boolean
  $isMy: boolean
}
const TwIconReactionAbsoluteContainer = tw.div<IIconReaction>`
  ${({$isDropdownOpen}) => ($isDropdownOpen ? 'opacity-0' : 'opacity-100')}
  ${({$isMy}) => ($isMy ? '-left-4' : '-right-4')}
  absolute
  -bottom-3
  cursor-pointer
  text-info/80
`

interface ITwDropdown {
  $isMouseOver: boolean
  $isVisible: boolean
  $isMy: boolean
}
const TwDropdown = tw(Dropdown)<ITwDropdown>`
  ${({$isMouseOver}) => ($isMouseOver ? 'opacity-100' : 'opacity-0')}
  ${({$isVisible}) => $isVisible && 'dropdown-open'}
  ${({$isMy}) => ($isMy ? 'left-0' : 'right-0')}
  absolute
  bottom-0
  hover:opacity-100
  transition-opacity
  ease-in-out
  duration-150
`

interface ITwDropdownMenu {
  $isMy: boolean
}
const TwDropdownMenu = tw(Dropdown.Menu)<ITwDropdownMenu>`
  ${({$isMy}) => ($isMy ? '-left-6' : '-right-6')}
  -top-5
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
  return (
    <>
      <TwDropdown
        $isVisible={showChoice.value}
        $isMouseOver={isMouseOver}
        $isMy={my}
        onClickOutside={showChoice.turnOff}
      >
        <TwIconReactionAbsoluteContainer
          $isDropdownOpen={showChoice.value}
          $isMy={my}
        >
          <IconMoodSmile size={24} onClick={showChoice.turnOn} />
        </TwIconReactionAbsoluteContainer>
        <TwDropdownMenu $isMy={my}>
          <ReactionsDropdownContent message={message} showChoice={showChoice} />
        </TwDropdownMenu>
      </TwDropdown>
    </>
  )
}
