import {Loader} from '@/components/common/loader'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'
import {SimpleScrollbar} from '../common/simple-scrollbar'
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
  return <Messages />
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
    <SimpleScrollbar>
      <div className="flex flex-col gap-2 px-4">
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
    </SimpleScrollbar>
  )
})
