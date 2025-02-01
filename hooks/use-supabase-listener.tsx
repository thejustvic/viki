'use client'

import {
  MaybeSession,
  SupabaseContext
} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {usePageVisibility} from './use-page-visibility'

export const useSupabaseListener = (
  supabase: SupabaseContext['supabase'],
  user: SupabaseContext['user'],
  mySession: MaybeSession
) => {
  const router = useRouter()
  const isPageVisible = usePageVisibility()

  useEffect(() => {
    void (async () => {
      if (!user) {
        router.refresh()
      }
    })()
  }, [isPageVisible])

  useEffect(() => {
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.access_token !== mySession?.access_token) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, user])
}
