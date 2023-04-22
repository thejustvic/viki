'use client'

import {GlobalContext, GlobalStore} from '@/components/global/global-store'
import {Theme} from '@/components/global/types'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {ReactNode} from 'react'

interface Props {
  children: ReactNode
  serverTheme: Theme | undefined
}

export default function GlobalProvider({children, serverTheme}: Props) {
  const {session} = useSupabase()
  const store = useMemoOne(() => new GlobalStore(serverTheme), [session])

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
