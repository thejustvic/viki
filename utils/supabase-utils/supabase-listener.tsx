'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

interface Props {
  serverAccessToken?: string
}

export default function SupabaseListener({serverAccessToken}: Props) {
  const {supabase} = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== serverAccessToken) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, router, supabase])

  return null
}
