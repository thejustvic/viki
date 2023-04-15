import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'
import {Post} from '../../types'
import {useModalPostStore} from '../modal-post-store'
import {getPostCreatorById} from './get-post-creator-by-id'

export const usePostCreatorListener = (
  userId: Post['by'] | undefined
): void => {
  const [, store] = useModalPostStore()
  const {supabase} = useSupabase()

  const {data, error, loading} = useSupabaseFetch(
    userId ? () => getPostCreatorById(userId, supabase) : null,
    [userId]
  )

  useEffect(() => {
    store.setPostCreator({
      loading,
      data,
      error
    })
  }, [data, error, loading])
}
