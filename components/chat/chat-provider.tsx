'use client'

import {useLocalObservable} from 'mobx-react-lite'
import {ReactNode} from 'react'
import {ChatContext, ChatStore} from './chat-store'

interface Props {
  children: ReactNode
}

export default function ChatProvider({children}: Props) {
  const store = useLocalObservable(() => new ChatStore())

  return (
    <ChatContext.Provider value={store}>
      <>{children}</>
    </ChatContext.Provider>
  )
}
