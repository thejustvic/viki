import {UserImage} from '@/components/common/user-image'
import {Button} from '@/components/daisyui/button'
import {ChatBubble} from '@/components/daisyui/chat-bubble'
import {Dropdown} from '@/components/daisyui/dropdown'
import {format, formatDistance} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {MouseEvent} from 'react'
import {twJoin} from 'tailwind-merge'
import {useChatHandlers} from './chat-handlers'
import {useChatMessageHandlers} from './chat-message-handlers'
import {ReactionsSmiley} from './reactions/reactions-smiley'
import type {Message as MessageType} from './types'

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
      <ChatBubble.Message
        color={my ? undefined : undefined}
        className="break-words relative"
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
        <div
          className={twJoin(
            my ? 'left-2' : 'right-2',
            'absolute bottom-px text-[9px]'
          )}
        >
          {formattedTime}
        </div>
      </ChatBubble.Message>
    </ChatBubble>
  )
})

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
      <Dropdown.Menu className="shadow-lg bg-base-200 px-2 py-0">
        {author_email}
        <div className="flex items-start gap-1">
          <time className="text-xs break-words w-[150px]">
            {timeDistance} on {time}
          </time>
          {my && (
            <Button size="xs" className="text-xs" onClick={remove}>
              delete
            </Button>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}
