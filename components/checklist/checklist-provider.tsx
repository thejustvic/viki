'use client'

import {Post} from '@/app/posts/components/types'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PropsWithChildren} from 'react'
import {ChecklistContext, ChecklistStore} from './checklist-store'
import {useChecklistListener} from './use-checklist-listener'

interface Props extends PropsWithChildren {
  id: Post['id']
}

export default function ChecklistProvider({id, children}: Props) {
  const {user, supabase} = useSupabase()
  const store = useMemoOne(() => new ChecklistStore(), [user])

  useChecklistListener({postId: id, supabase, store})

  return (
    <ChecklistContext.Provider value={store}>
      <>{children}</>
    </ChecklistContext.Provider>
  )
}
