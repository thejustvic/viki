'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {ReactNode, useMemo} from 'react'
import {ChatContext, ChatStore} from './chat-store'
import {useChatListener} from './use-chat-listener'

interface Props {
  children: ReactNode
}

export default function ChatProvider({children}: Props) {
  const {user, supabase} = useSupabase()
  const store = useMemo(() => new ChatStore(), [user])

  useChatListener(user, supabase, store)

  return (
    <ChatContext.Provider value={store}>
      <>{children}</>
    </ChatContext.Provider>
  )
}
