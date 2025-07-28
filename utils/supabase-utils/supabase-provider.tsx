'use client'

import {createClient} from '@/utils/supabase-utils/supabase-browser'
import {createContext, useContext, useEffect, useState} from 'react'

import {useMemoOne} from '@/hooks/use-memo-one'
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
  session: MaybeSession
}

export default function SupabaseProvider({
  children,
  serverUser,
  session
}: Props) {
  const supabase = useMemoOne(() => createClient(), [])

  const [clientUser, setClientUser] = useState<User | null>(null)
  useEffect(() => {
    if (serverUser) {
      return
    }
    void (async (): Promise<void> => {
      const {
        data: {user}
      } = await supabase.auth.getUser()
      if (user) {
        setClientUser(user)
      }
    })()
  }, [serverUser])

  return (
    <Context.Provider
      value={{supabase, user: serverUser ?? clientUser, session}}
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
