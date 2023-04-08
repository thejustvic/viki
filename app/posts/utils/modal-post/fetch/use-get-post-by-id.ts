import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'
import {Post} from '../../types'
import {useModalPostStore} from '../modal-post-store'
import {getPostById} from './get-post-by-id'

export const useGetPostById = (postId: Post['id'] | null): void => {
  const [, store] = useModalPostStore()
  const {supabase} = useSupabase()

  const effect = (): (() => void) => {
    const fetch = async (): Promise<void> => {
      if (!postId) {
        return
      }
      store.setPost({
        load: true,
        data: null,
        error: null
      })
      const {data, error} = await getPostById(postId, supabase)
      if (error) {
        store.setPost({
          load: false,
          data: null,
          error
        })
      }
      store.setPost({
        load: false,
        data,
        error: null
      })
    }
    void fetch()

    return () =>
      store.setPost({
        load: false,
        data: null,
        error: null
      })
  }

  useEffect(effect, [postId])
}
