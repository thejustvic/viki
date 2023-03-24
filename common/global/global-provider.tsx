'use client'

import {GlobalContext, GlobalStore} from '@/common/global/global-store'
import {Theme} from '@/common/global/types'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

interface Props {
  children: React.ReactNode
  serverTheme: Theme
}

export default function GlobalProvider({children}: Props) {
  const router = useRouter()
  const {session} = useSupabase()
  const [store] = useState(() => new GlobalStore())

  useEffect(() => {
    if (!session) {
      router.refresh()
    }
  }, [session])

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
