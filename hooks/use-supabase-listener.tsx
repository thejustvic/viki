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
    void (async () => {
      const {data} = await supabase.auth.getSession()
      !data.session && router.refresh()
    })()
  }, [isPageVisible])

  useEffect(() => {
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== mySession?.access_token) {
        router.refresh()
      }
      // Check if there's a hash fragment in the URL
      if (window.location.hash) {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        )
        const accessToken = hashParams.get('access_token')

        if (accessToken) {
          // Remove the disgusting hash from the URL without reloading the page
          window.history.replaceState(null, '', window.location.pathname)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mySession, router, supabase])
}
