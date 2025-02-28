import {Checkbox} from '@/components/checklist/types'
import {createClient} from './supabase-browser'

export const getBrowserChecklist = async (
  postId: string | undefined
): Promise<Checkbox[] | null> => {
  if (!postId) {
    return []
  }
  const supabase = createClient()
  const {data} = await supabase
    .from('checklist')
    .select()
    .eq('post_id', postId)
    .order('created_at')

  return data
}
