import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import type {Post} from './types'

interface Handlers {
  removePost: (id: Post['id']) => Promise<void>
  insertPost: (text: string) => Promise<void>
  updatePost: (text: string, postId: string) => Promise<void>
  deletePostQueryParam: () => void
  addPostQueryParam: (value: string) => void
}

export const usePostHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const removePost = async (id: Post['id']): Promise<void> => {
    await supabase.from('posts').delete().eq('id', id)
  }

  const insertPost = async (text: string): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase.from('posts').insert({
      text,
      author_id: user.id,
      author_email: user.email || ''
    })
  }

  const updatePost = async (text: string, postId: string): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('posts')
      .update({
        text
      })
      .eq('id', postId)
  }

  const deletePostQueryParam = () => {
    const queryString = Util.deleteQueryParam(searchParams, 'post')
    Util.routerPushQuery(router, queryString, pathname)
  }

  const addPostQueryParam = (value: string) => {
    const queryString = Util.addQueryParam(searchParams, 'post', value)
    Util.routerPushQuery(router, queryString, pathname)
  }

  return {
    removePost,
    insertPost,
    updatePost,
    deletePostQueryParam,
    addPostQueryParam
  }
}
