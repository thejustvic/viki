import {ReactionsDropdown} from '@/components/chat/reactions/reactions-dropdown'
import {ReactionsEmptyList} from '@/components/chat/reactions/reactions-empty-list'
import {ReactionsSmileyList} from '@/components/chat/reactions/reactions-smiley-list'
import {Message} from '@/components/chat/types'
import {ObjUtil} from '@/utils/obj-util'
import tw from 'tailwind-styled-components'

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
