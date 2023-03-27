'use client'

import {GlobalContext, GlobalStore} from '@/common/global/global-store'
import {Theme} from '@/common/global/types'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useRouterRefresh} from '@/hooks/use-router-refresh'

interface Props {
  children: React.ReactNode
  serverTheme: Theme
}

export default function GlobalProvider({children, serverTheme}: Props) {
  useRouterRefresh()
  const store = useMemoOne(() => new GlobalStore(serverTheme), [])

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
