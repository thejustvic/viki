import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import type {Post} from './types'

interface Handlers {
  removePost: (id: Post['id']) => Promise<void>
  insertPost: (text: string) => Promise<void>
  updatePost: (text: string, postId: string) => Promise<void>
}

export const usePostHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

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

  return {
    removePost,
    insertPost,
    updatePost
  }
}
