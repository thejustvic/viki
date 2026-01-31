'use client'

import {PropsWithChildren, useState} from 'react'
import {CardChecklistContext, CardChecklistStore} from './card-checklist-store'

export default function CardChecklistProvider({children}: PropsWithChildren) {
  const [store] = useState(() => new CardChecklistStore())

  return (
    <CardChecklistContext.Provider value={store}>
      <>{children}</>
    </CardChecklistContext.Provider>
  )
}
