import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export const useRouterRefresh = () => {
  const {session} = useSupabase()
  const router = useRouter()
  useEffect(() => {
    if (!session) {
      router.refresh()
    }
  }, [session])
}
