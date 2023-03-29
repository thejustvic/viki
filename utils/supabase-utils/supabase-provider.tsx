'use client'

import {createBrowserClient} from '@/utils/supabase-utils/supabase-browser'
import {createContext, useContext} from 'react'
import {useSupabaseListener} from '../../hooks/use-supabase-listener'

import {useMemoOne} from '@/hooks/use-memo-one'
import type {Database} from '@/utils/database.types'
import type {Session, SupabaseClient} from '@supabase/auth-helpers-nextjs'

export type MaybeSession = Session | null

export type SupabaseContext = {
  supabase: SupabaseClient<Database>
  session: MaybeSession
}

const Context = createContext<SupabaseContext>({} as SupabaseContext)

interface Props {
  children: React.ReactNode
  session: MaybeSession
}

export default function SupabaseProvider({children, session}: Props) {
  const supabase = useMemoOne(() => createBrowserClient(), [])
  useSupabaseListener(supabase, session)

  return (
    <Context.Provider value={{supabase, session}}>
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
