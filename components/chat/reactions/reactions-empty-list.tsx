import {ReactionsDropdownContent} from '@/components/chat/reactions/reactions-dropdown-content'
import {Message} from '@/components/chat/types'
import {Dropdown} from '@/components/daisyui/dropdown'
import {IconMoodSmileFilled} from '@tabler/icons-react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'

const TwDropdown = tw(Dropdown)`
  absolute 
  bottom-0 
  left-0 
  opacity-0 
  hover:opacity-100 
  transition-opacity 
  ease-in-out 
  duration-150
`

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
  isMouseOver: boolean
}

export const ReactionsEmptyList = ({
  message,
  isMouseOver
}: EmptyReactionsProps) => {
  return (
    <TwDropdown
      className={twJoin(isMouseOver && 'opacity-100')}
      hover={!isMobile}
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
        <ReactionsDropdownContent message={message} />
      </Dropdown.Menu>
    </TwDropdown>
  )
}
