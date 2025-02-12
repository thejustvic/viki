import {useGlobalStore} from '@/components/global/global-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'

export const useLoggingOff = () => {
  const {user} = useSupabase()
  const [, globalStore] = useGlobalStore()

  useEffect(() => {
    if (user) {
      globalStore.setLoggingOff()
    }
  }, [user])
}
