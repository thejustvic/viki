'use client'

import {
  GlobalContext,
  GlobalStore
} from '@/components/global-provider/global-store'
import {Theme} from '@/components/global-provider/types'
import {usePageRefresh} from '@/hooks/use-page-refresh'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {ReactNode, useEffect, useState} from 'react'

interface Props {
  children: ReactNode
  serverTheme: Theme | undefined
}

export default function GlobalProvider({children, serverTheme}: Props) {
  usePageRefresh()
  const [store, setStore] = useState<GlobalStore>()
  const {user} = useSupabase()

  useEffect(() => {
    setStore(new GlobalStore(serverTheme))
  }, [user])

  if (!store) {
    return
  }

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
