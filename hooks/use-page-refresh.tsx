'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export const usePageRefresh = () => {
  const router = useRouter()
  const {session: mySession, supabase} = useSupabase()

  useEffect(() => {
    void (async (): Promise<void> => {
      const {
        data: {session}
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
      }
    })()
  }, [])

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
