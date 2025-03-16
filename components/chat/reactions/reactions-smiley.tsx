import {ObjUtil} from '@/utils/obj-util'
import tw from 'tailwind-styled-components'
import {Message} from '../types'
import {ReactionsDropdown} from './reactions-dropdown'
import {ReactionsEmptyList} from './reactions-empty-list'
import {ReactionsSmileyList} from './reactions-smiley-list'

const TwContainer = tw.div`
  relative
  flex
  flex-wrap
  gap-1
  items-center
`

interface SmileyReactionsProps {
  message: Message
  isMouseOver: boolean
}

export const ReactionsSmiley = ({
  message,
  isMouseOver
}: SmileyReactionsProps) => {
  if (ObjUtil.isEmpty(message.reactions)) {
    return <ReactionsEmptyList message={message} isMouseOver={isMouseOver} />
  }
  return (
    <TwContainer>
      <ReactionsSmileyList message={message} />
      <ReactionsDropdown message={message} />
    </TwContainer>
  )
}
