import {useBoolean} from '@/hooks/use-boolean'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {formatDistance} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {MouseEvent, useEffect, useRef, useState} from 'react'
import tw from 'tailwind-styled-components'
import {Loader} from '../common/loader'
import {PerfectScrollbar} from '../common/perfect-scrollbar'
import {UserImage} from '../common/user-image'
import {Button} from '../daisyui/button'
import {ChatBubble} from '../daisyui/chat-bubble'
import {Dropdown} from '../daisyui/dropdown'
import {useChatHandlers} from './chat-handlers'
import {useChatStore} from './chat-store'
import {SmileyReactions} from './reactions/smiley-reactions'
import {useReactionsHandlers} from './reactions/use-reactions-handlers'
import {useUsersWhoReacted} from './reactions/use-users-who-reacted'
import type {Message as MessageType} from './types'

export const Chat = observer(() => {
  const [scrollEl, setScrollEl] = useState<HTMLElement>()
  const [state] = useChatStore()

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }, [state.chat.data, scrollEl])

  return (
    <PerfectScrollbar className="px-4" containerRef={setScrollEl}>
      <Messages />
    </PerfectScrollbar>
  )
})

const TwState = tw.div`
  flex
  h-full
  w-full
  justify-center
  items-center
`

const Messages = observer(() => {
  const [state] = useChatStore()
  const {user} = useSupabase()

  if (state.chat.error) {
    return <TwState>{state.chat.error.message}</TwState>
  }

  if (state.chat.loading) {
    return (
      <TwState>
        <Loader />
      </TwState>
    )
  }

  if (!state.chat.data) {
    return <TwState className="text-info">can not take data</TwState>
  }

  if (state.chat.data.length === 0) {
    return <TwState className="text-info">type some message</TwState>
  }

  const userEmail = user?.email

  return (
    <div className="flex flex-col gap-2 h-[54px]">
      {state.chat.data.map(message => {
        return (
          <Message
            key={message.id}
            message={message}
            my={message.author_email === userEmail}
          />
        )
      })}
    </div>
  )
})

interface BubbleProps {
  message: MessageType
  my?: boolean
}

const Message = observer(({my, message}: BubbleProps) => {
  const showReactions = useBoolean(false)
  const {selectReaction} = useReactionsHandlers()
  const {users: allUsersWhoReacted} = useUsersWhoReacted(message.reactions)

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
        <SmileyReactions
          allUsersWhoReacted={allUsersWhoReacted}
          message={message}
          isMouseOver={showReactions.value}
        />
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
