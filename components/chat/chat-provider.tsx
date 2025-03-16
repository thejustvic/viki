'use client'

import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {ReactNode} from 'react'
import {ChatContext, ChatStore} from './chat-store'
import {Message} from './types'
import {useChatListener} from './use-chat-listener'

interface Props {
  children: ReactNode
  serverChat: Message[]
}

export default function ChatProvider({children, serverChat}: Props) {
  const {user, supabase} = useSupabase()
  const store = useMemoOne(() => new ChatStore(serverChat), [user])

  useChatListener(supabase, store)

  return (
    <ChatContext.Provider value={store}>
      <>{children}</>
    </ChatContext.Provider>
  )
}
