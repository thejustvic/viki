import {ReactionsDropdown} from '@/components/chat/reactions/reactions-dropdown'
import {ReactionsEmptyList} from '@/components/chat/reactions/reactions-empty-list'
import {ReactionsSmileyList} from '@/components/chat/reactions/reactions-smiley-list'
import {Message} from '@/components/chat/types'
import {BooleanHookState} from '@/hooks/use-boolean'
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
  showChoice: BooleanHookState
  isMouseOver: boolean
  my: boolean
}

export const ReactionsSmiley = ({
  message,
  showChoice,
  isMouseOver,
  my
}: SmileyReactionsProps) => {
  if (ObjUtil.isEmpty(message.reactions)) {
    return (
      <ReactionsEmptyList
        my={my}
        message={message}
        showChoice={showChoice}
        isMouseOver={isMouseOver}
      />
    )
  }
  return (
    <TwContainer>
      <ReactionsSmileyList message={message} />
      <ReactionsDropdown message={message} showChoice={showChoice} />
    </TwContainer>
  )
}
