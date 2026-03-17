'use client'

import {useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {CardInfoStore, CardInfoStoreContext} from './card-info-store'

export default function CardInfoProvider({children}: PropsWithChildren) {
  const store = useLocalObservable(() => new CardInfoStore())

  return (
    <CardInfoStoreContext.Provider value={store}>
      <>{children}</>
    </CardInfoStoreContext.Provider>
  )
}
