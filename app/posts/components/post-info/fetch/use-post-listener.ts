import {useFetch} from '@/hooks/use-fetch'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import type {User} from '@supabase/supabase-js'
import {useEffect} from 'react'
import {Post} from '../../types'
import {usePostInfoStore} from '../post-info-store'
import {getPostById} from './get-post-by-id'

interface PostProps {
  postId: Post['id'] | null
  authorId: Post['author_id'] | undefined
}

export const usePostListener = ({postId, authorId}: PostProps): void => {
  const [, store] = usePostInfoStore()
  const {supabase} = useSupabase()

  const {data, error, loading} = useSupabaseFetch(
    postId ? () => getPostById(postId, supabase) : null,
    [postId]
  )

  const {
    data: userData,
    error: userError,
    loading: userLoading
  } = useFetch<User>(
    authorId
      ? () =>
          fetch(`${window.location.origin}/api/retrieve-user?id=${authorId}`)
      : null,
    [authorId]
  )

  useEffect(() => {
    store.setPost({
      loading,
      data,
      error
    })
  }, [data, loading, error])

  useEffect(() => {
    store.setPostCreator({
      loading: userLoading,
      data: userData,
      error: userError
    })
  }, [userData, userError, userLoading])
}
