'use client'

import {createClient} from '@/utils/supabase-browser'
import {createContext, useContext, useState} from 'react'

import type {Database} from '@/utils/database.types'
import type {SupabaseClient} from '@supabase/auth-helpers-nextjs'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

interface Props {
  children: React.ReactNode
}

export default function SupabaseProvider({children}: Props) {
  const [supabase] = useState(() => createClient())

  return (
    <Context.Provider value={{supabase}}>
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
