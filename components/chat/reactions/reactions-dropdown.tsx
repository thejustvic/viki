import {Dropdown} from '@/components/daisyui/dropdown'
import {IconMoodSmile} from '@tabler/icons-react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {Message} from '../types'
import {ReactionsDropdownContent} from './reactions-dropdown-content'

const TwIconReaction = tw.div`
  cursor-pointer
`

export const ReactionsDropdown = ({message}: {message: Message}) => {
  return (
    <Dropdown hover={!isMobile}>
      <TwIconReaction
        className={twJoin('flex items-center')}
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
