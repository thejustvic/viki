import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Post} from './types'

interface Handlers {
  removePost: (id: Post['id']) => Promise<void>
  insertPost: (text: string) => Promise<void>
  updatePost: (text: string, postId: string) => Promise<void>
}

export const usePostHandlers = (): Handlers => {
  const {supabase, session} = useSupabase()

  const removePost = async (id: Post['id']): Promise<void> => {
    await supabase.from('posts').delete().eq('id', id)
  }

  const insertPost = async (text: string): Promise<void> => {
    if (!session) {
      throw Error('You must provide a session object!')
    }
    await supabase.from('posts').insert({
      text,
      by: session.user.id
    })
  }

  const updatePost = async (text: string, postId: string): Promise<void> => {
    if (!session) {
      throw Error('You must provide a session object!')
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
