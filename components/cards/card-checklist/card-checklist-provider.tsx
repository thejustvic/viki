'use client'

import {useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {CardChecklistContext, CardChecklistStore} from './card-checklist-store'

export default function CardChecklistProvider({children}: PropsWithChildren) {
  const store = useLocalObservable(() => new CardChecklistStore())

  return (
    <CardChecklistContext.Provider value={store}>
      <>{children}</>
    </CardChecklistContext.Provider>
  )
}
