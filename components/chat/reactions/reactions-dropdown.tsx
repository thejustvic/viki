import {ReactionsDropdownContent} from '@/components/chat/reactions/reactions-dropdown-content'
import {Message} from '@/components/chat/types'
import {Dropdown} from '@/components/daisyui/dropdown'
import {IconMoodSmile} from '@tabler/icons-react'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'

const TwIconReaction = tw.div`
  cursor-pointer
  flex
  items-center
`

export const ReactionsDropdown = ({message}: {message: Message}) => {
  return (
    <Dropdown hover={!isMobile}>
      <TwIconReaction
        tabIndex={isMobile ? 0 : undefined}
        role={isMobile ? 'button' : ''}
      >
        <IconMoodSmile size={24} />
      </TwIconReaction>
      <Dropdown.Menu
        className="-top-2 -left-2"
        tabIndex={isMobile ? 0 : undefined}
      >
        <ReactionsDropdownContent message={message} />
      </Dropdown.Menu>
    </Dropdown>
  )
}
