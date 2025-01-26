import {useBoolean} from '@/hooks/use-boolean'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {formatDistance} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {MouseEvent, ReactNode, useEffect, useState} from 'react'
import {Button, ChatBubble, Dropdown} from 'react-daisyui'
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
    <div className="flex flex-col gap-2 h-[54px]">
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
  const show = useBoolean(false)

  const remove = async (e: MouseEvent) => {
    e.stopPropagation()
    await removeMessage(id)
  }
  const timeDistance = formatDistance(new Date(time), new Date(), {
    addSuffix: true
  })
  return (
    <Dropdown
      hover
      horizontal={my ? 'left' : 'right'}
      item={
        show.value && (
          <Dropdown.Menu
            className="gap-1 shadow-lg"
            onMouseEnter={show.turnOn}
            onMouseLeave={show.turnOff}
            style={{top: -17}}
          >
            {author}
            <div className="flex items-start gap-1">
              <ChatBubble.Time className="text-xs">
                {timeDistance}
              </ChatBubble.Time>
              {my && (
                <Button size="xs" className="text-xs" onClick={remove}>
                  delete
                </Button>
              )}
            </div>
          </Dropdown.Menu>
        )
      }
    >
      <div onMouseEnter={show.turnOn} onMouseLeave={show.turnOff}>
        <UserImage src={avatar} shape="circle" />
      </div>
    </Dropdown>
  )
}
