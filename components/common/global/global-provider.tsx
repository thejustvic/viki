'use client'

import {
  GlobalContext,
  GlobalStore
} from '@/components/common/global/global-store'
import {Theme} from '@/components/common/global/types'
import {useMemoOne} from '@/hooks/use-memo-one'
import {makePersistable} from 'mobx-persist-store'
import {ReactNode, useEffect} from 'react'

interface Props {
  children: ReactNode
  serverTheme: Theme | undefined
}

export default function GlobalProvider({children, serverTheme}: Props) {
  const store = useMemoOne(() => new GlobalStore(serverTheme), [])

  useEffect(() => {
    void makePersistable(store, {
      name: 'GlobalStore',
      properties: ['state'],
      storage: window.localStorage
    })
  }, [])

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
