import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Post} from './types'

interface Handlers {
  removePost: (id: Post['id']) => Promise<void>
  insertPost: () => Promise<void>
}

export const usePostHandlers = (): Handlers => {
  const {supabase, session} = useSupabase()

  const removePost = async (id: Post['id']) => {
    await supabase.from('posts').delete().eq('id', id)
  }

  const insertPost = async () => {
    await supabase.from('posts').insert({
      text: (Math.random() + 1).toString(36).substring(7),
      by: session?.user.id
    })
  }

  return {
    removePost,
    insertPost
  }
}
