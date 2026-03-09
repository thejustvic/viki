'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export const usePageRefresh = () => {
  const router = useRouter()
  const {user, session: mySession, supabase} = useSupabase()

  useEffect(() => {
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && user?.id === session?.user?.id) {
        return
      }

      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh()
      }

      if (session?.access_token !== mySession?.access_token) {
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase, mySession])
}
