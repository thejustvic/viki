import {useFetch} from '@/hooks/use-fetch'
import {User} from '@supabase/auth-helpers-nextjs'
import {useEffect} from 'react'
import {Post} from '../../types'
import {useModalPostStore} from '../modal-post-store'

export const usePostCreatorListener = (
  userId: Post['user_id'] | undefined
): void => {
  const [, store] = useModalPostStore()

  const {data, error, loading} = useFetch<User>(
    userId
      ? () => fetch(`${window.location.origin}/api/retrieve-user?id=${userId}`)
      : null,
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
