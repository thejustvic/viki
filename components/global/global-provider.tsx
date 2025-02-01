'use client'

import {GlobalContext, GlobalStore} from '@/components/global/global-store'
import {Theme} from '@/components/global/types'
import {Session} from '@supabase/supabase-js'
import {ReactNode, useEffect, useState} from 'react'

interface Props {
  children: ReactNode
  serverTheme: Theme | undefined
  session: Session | null
}

export default function GlobalProvider({
  children,
  serverTheme,
  session
}: Props) {
  const [store, setStore] = useState<GlobalStore>()
  useEffect(() => {
    setStore(new GlobalStore(serverTheme))
  }, [session])

  if (!store) {
    return
  }

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
