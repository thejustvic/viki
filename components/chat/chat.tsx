import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {formatDistance} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {MouseEvent, ReactNode, useEffect, useState} from 'react'
import {ChatBubble, Dropdown} from 'react-daisyui'
import {PerfectScrollbar} from '../common/perfect-scrollbar'
import {UserImage} from '../common/user-image'
import {useChatHandlers} from './chat-handlers'
import {useChatStore} from './chat-store'

export const Chat = observer(() => {
  const [scrollEl, setScrollEl] = useState<HTMLElement>()
  const [state] = useChatStore()

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }, [state.messages, scrollEl])

  return (
    <PerfectScrollbar
      className="px-4 -mx-1"
      containerRef={ref => setScrollEl(ref)}
    >
      <Messages />
    </PerfectScrollbar>
  )
})

const Messages = observer(() => {
  const [state] = useChatStore()
  const {session} = useSupabase()

  return (
    <div className="grid gap-2 h-[54px]">
      {state.messages.map(message => {
        return (
          <Message
            key={message.id}
            id={message.id}
            author={message.author_email}
            time={message.created_at}
            avatar={message.author_image}
            my={message.author_email === session?.user.email}
          >
            {message.text}
          </Message>
        )
      })}
    </div>
  )
})

interface BubbleProps {
  children: ReactNode
  id: string
  author: string
  time: string
  avatar: string
  my?: boolean
}

const Message = ({children, author, time, avatar, my, id}: BubbleProps) => {
  const {removeMessage} = useChatHandlers()

  const remove = async (e: MouseEvent) => {
    e.stopPropagation()
    await removeMessage(id)
  }
  const timeDistance = formatDistance(new Date(time), new Date(), {
    addSuffix: true
  })
  return (
    <ChatBubble end={my}>
      <Dropdown hover className="chat-image" horizontal={my ? 'left' : 'right'}>
        <UserImage src={avatar} shape="circle" />
        <Dropdown.Menu className="gap-1">
          {author}
          <ChatBubble.Time>{timeDistance}</ChatBubble.Time>
          {my && (
            <Dropdown.Item onClick={remove}>
              <p className="flex justify-center w-full text-sm">
                Delete message
              </p>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <ChatBubble.Message
        color={my ? 'primary' : undefined}
        className="break-words"
      >
        {children}
      </ChatBubble.Message>
    </ChatBubble>
  )
}
