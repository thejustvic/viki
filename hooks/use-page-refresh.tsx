'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export const usePageRefresh = () => {
  const router = useRouter()
  const {supabase} = useSupabase()

  useEffect(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange(
      async event => {
        if (
          event === 'SIGNED_OUT' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'INITIAL_SESSION'
        ) {
          router.refresh()
        }
      }
    )

    return () => authListener.subscription.unsubscribe()
  }, [supabase, router])
}
