'use client'

import {createClient} from '@/utils/supabase-utils/supabase-browser'
import {createContext, useContext, useState} from 'react'

import type {Database} from '@/utils/database.types'
import type {Session, SupabaseClient, User} from '@supabase/supabase-js'

export type MaybeSession = Session | null

export type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user: User | null
  session: MaybeSession
}

const Context = createContext<SupabaseContext>({} as SupabaseContext)

interface Props {
  children: React.ReactNode
  serverUser: User | null
  serverSession: MaybeSession
}

export default function SupabaseProvider({
  children,
  serverUser,
  serverSession
}: Props) {
  const [supabase] = useState(() => createClient())

  return (
    <Context.Provider
      value={{
        supabase,
        user: serverUser,
        session: serverSession
      }}
    >
      {children}
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
