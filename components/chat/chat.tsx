import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {formatDistance} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {MouseEvent, ReactNode, useEffect, useState} from 'react'

import {PerfectScrollbar} from '../common/perfect-scrollbar'
import {UserImage} from '../common/user-image'
import {Button} from '../daisyui/button'
import {ChatBubble} from '../daisyui/chat-bubble'
import {Dropdown} from '../daisyui/dropdown'
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
  const {user} = useSupabase()

  return (
    <div className="flex flex-col gap-2 h-[54px]">
      {state.messages.map(message => {
        return (
          <Message
            key={message.id}
            id={message.id}
            author={message.author_email}
            time={message.created_at}
            avatar={message.author_image}
            my={message.author_email === user?.email}
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

const Message = (props: BubbleProps) => {
  const {my, children} = props

  return (
    <ChatBubble end={my} className="grid-flow-col">
      <ChatBubble.Message
        color={my ? 'primary' : undefined}
        className="break-words"
      >
        {children}
      </ChatBubble.Message>
      <MessageDropdown {...props} />
    </ChatBubble>
  )
}

const MessageDropdown = ({author, time, avatar, my, id}: BubbleProps) => {
  const {removeMessage} = useChatHandlers()

  const remove = async (e: MouseEvent) => {
    e.stopPropagation()
    await removeMessage(id)
  }
  const timeDistance = formatDistance(new Date(time), new Date(), {
    addSuffix: true
  })
  return (
    <Dropdown placements={my ? ['left'] : ['right']} hover>
      <UserImage src={avatar} shape="circle" />
      <Dropdown.Menu className="shadow-lg bg-base-200 px-2 py-0">
        {author}
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
