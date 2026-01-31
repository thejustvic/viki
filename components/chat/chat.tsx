import {Loader} from '@/components/common/loader'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'
import {ChatMessage} from './chat-message'
import {useChatStore} from './chat-store'
import {useUsersWhoReacted} from './reactions/use-users-who-reacted'
import {useChatListener} from './use-chat-listener'

export const ChatBase = observer(() => {
  const {user, supabase} = useSupabase()
  const [, store] = useChatStore()
  useChatListener(user, supabase, store)

  return <Chat />
})

const Chat = observer(() => {
  const [scrollEl, setScrollEl] = useState<HTMLElement>()
  const [state, store] = useChatStore()

  useEffect(() => {
    if (scrollEl && state.isNeedToUpdateScroll) {
      scrollEl.scrollTop = scrollEl.scrollHeight
      store.setIsNeedToUpdateScroll(false)
    }
  }, [state.chat.data, state.isNeedToUpdateScroll, scrollEl])

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

  return <MessageList />
})

const MessageList = observer(() => {
  const [state] = useChatStore()
  const {user} = useSupabase()

  useUsersWhoReacted()

  const userEmail = user?.email

  return (
    <div className="flex flex-col gap-2 h-[54px]">
      {state.chat.data?.map(message => {
        return (
          <ChatMessage
            key={message.id}
            message={message}
            my={message.author_email === userEmail}
          />
        )
      })}
    </div>
  )
})
