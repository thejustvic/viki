'use client'

import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {ReactNode} from 'react'
import {ChatContext, ChatStore} from './chat-store'
import {useChatListener} from './use-chat-listener'

interface Props {
  children: ReactNode
}

export default function ChatProvider({children}: Props) {
  const {user, supabase} = useSupabase()
  const store = useMemoOne(() => new ChatStore(), [user])

  useChatListener(supabase, store)

  return (
    <ChatContext.Provider value={store}>
      <>{children}</>
    </ChatContext.Provider>
  )
}
