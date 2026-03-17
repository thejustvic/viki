import {UserImage} from '@/components/common/user-image'
import {Button} from '@/components/daisyui/button'
import {ChatBubble} from '@/components/daisyui/chat-bubble'
import {Dropdown} from '@/components/daisyui/dropdown'
import {format, formatDistance} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {MouseEvent} from 'react'
import tw from '../common/tw-styled-components'
import {useChatHandlers} from './chat-handlers'
import {useChatMessageHandlers} from './chat-message-handlers'
import {ReactionsSmiley} from './reactions/reactions-smiley'
import type {Message as MessageType} from './types'

const TwChatBubbleMessage = tw(ChatBubble.Message)`
  wrap-break-words
  wrap-anywhere
  relative
`
interface BubbleProps {
  message: MessageType
  my?: boolean
}
export const ChatMessage = observer(({my, message}: BubbleProps) => {
  const {
    showChoice,
    showReactions,
    handlePutHeart,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart
  } = useChatMessageHandlers(message)
  const formattedTime = format(message.created_at, 'HH:mm')

  return (
    <ChatBubble end={my}>
      <MessageDropdown my={my} message={message} />
      <TwChatBubbleMessage
        color={my ? 'primary' : 'secondary'}
        onDoubleClick={handlePutHeart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        {message.text}
        <ReactionsSmiley
          my={Boolean(my)}
          message={message}
          showChoice={showChoice}
          isMouseOver={showReactions.value}
        />
        <TwFormattedTime $isMy={my}>{formattedTime}</TwFormattedTime>
      </TwChatBubbleMessage>
    </ChatBubble>
  )
})

interface ITwFormattedTime {
  $isMy: boolean | undefined
}
const TwFormattedTime = tw.div<ITwFormattedTime>`
  ${({$isMy}) => ($isMy ? 'left-2' : 'right-2')}
  absolute
  bottom-px
  text-[9px]
`

const TwDropdownMenu = tw(Dropdown.Menu)`
  shadow-lg
  bg-base-300/90
  px-2
  py-0
`

const TwWrapper = tw.div`
  flex
  items-start
  gap-1
`

const TwTime = tw.time`
  text-xs
  wrap-break-words
  wrap-anywhere
  w-[150px]
`

const MessageDropdown = ({
  my,
  message: {id, created_at, author_image, author_email}
}: BubbleProps) => {
  const {removeMessage} = useChatHandlers()

  const remove = async (e: MouseEvent) => {
    e.stopPropagation()
    await removeMessage(id)
  }
  const timeDistance = formatDistance(new Date(created_at), new Date(), {
    addSuffix: true,
    includeSeconds: true
  })
  const time = format(new Date(created_at), 'MMMM do, yyyy')
  return (
    <Dropdown
      placements={my ? ['left'] : ['right']}
      hover
      className="chat-image"
    >
      <UserImage src={author_image} shape="circle" />
      <TwDropdownMenu>
        {author_email}
        <TwWrapper>
          <TwTime>
            {timeDistance} on {time}
          </TwTime>
          {my && (
            <Button
              soft
              color="error"
              size="xs"
              className="text-xs"
              onClick={remove}
            >
              delete
            </Button>
          )}
        </TwWrapper>
      </TwDropdownMenu>
    </Dropdown>
  )
}
