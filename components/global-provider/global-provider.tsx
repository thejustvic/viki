'use client'

import {
  GlobalContext,
  GlobalStore
} from '@/components/global-provider/global-store'
import {Theme} from '@/components/global-provider/types'
import {usePageRefresh} from '@/hooks/use-page-refresh'
import {useLocalObservable} from 'mobx-react-lite'
import {ReactNode} from 'react'

interface Props {
  children: ReactNode
  serverTheme: Theme | undefined
}

export default function GlobalProvider({children, serverTheme}: Props) {
  usePageRefresh()

  const store = useLocalObservable(() => new GlobalStore(serverTheme))

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
