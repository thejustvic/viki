import {ReactionsDropdownContent} from '@/components/chat/reactions/reactions-dropdown-content'
import {Message} from '@/components/chat/types'
import tw from '@/components/common/tw-styled-components'
import {Dropdown} from '@/components/daisyui/dropdown'
import {BooleanHookState} from '@/hooks/use-boolean'
import {IconMoodSmile} from '@tabler/icons-react'
import {twJoin} from 'tailwind-merge'

interface IIconReaction {
  $isDropdownOpen: boolean
}
const TwIconReaction = tw.div<IIconReaction>`
  ${({$isDropdownOpen}) => ($isDropdownOpen ? 'opacity-0' : 'opacity-50')}
  cursor-pointer
  flex
  items-center
  text-info
  transition-opacity
  ease-in-out
  duration-150
`

export const ReactionsDropdown = ({
  message,
  showChoice
}: {
  message: Message
  showChoice: BooleanHookState
}) => {
  return (
    <Dropdown
      onClickOutside={showChoice.turnOff}
      className={twJoin(showChoice.value && 'dropdown-open')}
    >
      <TwIconReaction
        $isDropdownOpen={showChoice.value}
        onClick={showChoice.turnOn}
      >
        <IconMoodSmile size={24} />
      </TwIconReaction>
      <Dropdown.Menu className="-top-2 -left-2">
        <ReactionsDropdownContent message={message} showChoice={showChoice} />
      </Dropdown.Menu>
    </Dropdown>
  )
}
