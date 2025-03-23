import {UserImage} from '@/components/common/user-image'
import {Button} from '@/components/daisyui/button'
import {ChatBubble} from '@/components/daisyui/chat-bubble'
import {Dropdown} from '@/components/daisyui/dropdown'
import {useBoolean} from '@/hooks/use-boolean'
import {formatDistance} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {MouseEvent, useRef} from 'react'
import {useChatHandlers} from './chat-handlers'
import {ReactionsSmiley} from './reactions/reactions-smiley'
import {useReactionsHandlers} from './reactions/use-reactions-handlers'
import type {Message as MessageType} from './types'

interface BubbleProps {
  message: MessageType
  my?: boolean
}

export const ChatMessage = observer(({my, message}: BubbleProps) => {
  const showReactions = useBoolean(false)
  const {selectReaction} = useReactionsHandlers()

  const lastTapRef = useRef<number>(0) // Use ref to avoid state updates

  const putHeart = async () => {
    await selectReaction('❤️', message)
  }

  const handleTap = (e: React.TouchEvent) => {
    e.preventDefault()
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      // Double Tap Detected!
      void putHeart()
    }
    lastTapRef.current = now
  }

  return (
    <ChatBubble end={my}>
      <MessageDropdown my={my} message={message} />
      <ChatBubble.Message
        color={my ? 'primary' : undefined}
        className="break-words relative"
        onMouseEnter={showReactions.turnOn}
        onMouseLeave={showReactions.turnOff}
        onDoubleClick={putHeart}
        onTouchStart={handleTap}
      >
        {message.text}
        <ReactionsSmiley message={message} isMouseOver={showReactions.value} />
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
          <time className="text-xs opacity-50">{timeDistance}</time>
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
