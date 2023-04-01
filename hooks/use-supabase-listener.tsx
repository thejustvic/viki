'use client'

import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {usePageVisibility} from './use-page-visibility'

export const useSupabaseListener = (
  supabase: SupabaseContext['supabase'],
  mySession: SupabaseContext['session']
) => {
  const router = useRouter()
  const isPageVisible = usePageVisibility()

  useEffect(() => {
    const getSession = async () => {
      const {data} = await supabase.auth.getSession()
      if (!data.session) {
        router.refresh()
      }
    }
    getSession()
  }, [isPageVisible])

  useEffect(() => {
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== mySession?.access_token) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mySession, router, supabase])
}
