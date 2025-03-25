import {ReactionsDropdownContent} from '@/components/chat/reactions/reactions-dropdown-content'
import {Message} from '@/components/chat/types'
import {Dropdown} from '@/components/daisyui/dropdown'
import {BooleanHookState} from '@/hooks/use-boolean'
import {IconMoodSmile} from '@tabler/icons-react'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'

const TwIconReaction = tw.div`
  cursor-pointer
  flex
  items-center
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
      <TwIconReaction onClick={showChoice.turnOn}>
        <IconMoodSmile size={24} />
      </TwIconReaction>
      <Dropdown.Menu className="-top-2 -left-2">
        <ReactionsDropdownContent message={message} showChoice={showChoice} />
      </Dropdown.Menu>
    </Dropdown>
  )
}
