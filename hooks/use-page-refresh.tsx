'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {usePageVisibility} from './use-page-visibility'

export const usePageRefresh = () => {
  const router = useRouter()
  const isPageVisible = usePageVisibility()
  const {session: mySession, supabase} = useSupabase()

  useEffect(() => {
    router.refresh()
  }, [isPageVisible])

  useEffect(() => {
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.access_token !== mySession?.access_token) {
        router.refresh()
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, mySession])
}
