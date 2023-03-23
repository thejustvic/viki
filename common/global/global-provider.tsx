'use client'

import {GlobalContext, GlobalStore} from '@/common/global/global-store'
import {Theme} from '@/common/global/types'
import {useState} from 'react'

interface Props {
  children: React.ReactNode
  serverTheme: Theme
}

export default function GlobalProvider({children}: Props) {
  const [store] = useState(() => new GlobalStore())

  return (
    <GlobalContext.Provider value={store}>
      <>{children}</>
    </GlobalContext.Provider>
  )
}
