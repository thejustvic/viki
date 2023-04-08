import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'
import {Post} from '../../types'
import {useModalPostStore} from '../modal-post-store'
import {getPostById} from './get-post-by-id'

export const usePostListener = (postId: Post['id'] | null): void => {
  const [, store] = useModalPostStore()
  const {supabase} = useSupabase()

  const {data, error, loading} = useSupabaseFetch(
    postId ? () => getPostById(postId, supabase) : null,
    [postId]
  )

  useEffect(() => {
    store.setPost({
      loading,
      data,
      error
    })
  }, [data, error, loading])
}
