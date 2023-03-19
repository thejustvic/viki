'use client'

import {createBrowserClient} from '@/utils/supabase-utils/supabase-browser'
import type {Session} from '@supabase/auth-helpers-nextjs'
import {createContext, useContext, useState} from 'react'

import type {Database} from '@/utils/database.types'
import type {SupabaseClient} from '@supabase/auth-helpers-nextjs'

type MaybeSession = Session | null

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
  const [supabase] = useState(() => createBrowserClient())

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
