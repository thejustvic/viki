'use client'

import {GlobalContext, GlobalStore} from '@/components/global/global-store'
import {Theme} from '@/components/global/types'
import {usePageRefresh} from '@/hooks/use-page-refresh'
import {ObjUtil} from '@/utils/obj-util'
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

  useEffect(() => {
    if (!store?.state.logging) {
      return
    }

    const logging = ObjUtil.values<GlobalStore['state']['logging']>(
      store.state.logging
    ).find(el => el === true)

    if (user && logging) {
      store.setLoggingOff()
    }
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
