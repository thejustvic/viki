'use client'

import {createClient} from '@/utils/supabase-utils/supabase-browser'
import {createContext, useContext} from 'react'
import {useSupabaseListener} from '../../hooks/use-supabase-listener'

import {useMemoOne} from '@/hooks/use-memo-one'
import type {Database} from '@/utils/database.types'
import type {Session, SupabaseClient, User} from '@supabase/supabase-js'

export type MaybeSession = Session | null

export type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user: User | null
}

const Context = createContext<SupabaseContext>({} as SupabaseContext)

interface Props {
  children: React.ReactNode
  user: User | null
  session: MaybeSession
}

export default function SupabaseProvider({children, user, session}: Props) {
  const supabase = useMemoOne(() => createClient(), [])
  useSupabaseListener(supabase, user, session)

  return (
    <Context.Provider value={{supabase, user}}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  } else {
    return context
  }
}
