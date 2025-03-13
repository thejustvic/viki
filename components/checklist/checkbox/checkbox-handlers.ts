import {
  SupabaseContext,
  useSupabase
} from '@/utils/supabase-utils/supabase-provider'
import {ChecklistStore} from '../checklist-store'
import {Checkbox} from '../types'

interface Handlers {
  removeCheckbox: (id: Checkbox['id']) => Promise<void>
  insertCheckbox: ({
    postId,
    title
  }: {
    postId: Checkbox['post_id']
    title: Checkbox['title']
  }) => Promise<void>
  updateCheckboxTitle: (
    text: Checkbox['title'],
    CheckboxId: Checkbox['id']
  ) => Promise<void>
  updateCheckboxIsCompleted: (
    is_completed: Checkbox['is_completed'],
    CheckboxId: Checkbox['id']
  ) => Promise<void>
  updateAllCheckboxIsCompleted: (
    is_completed: Checkbox['is_completed'],
    checklist: ChecklistStore['state']['checklist']['data']
  ) => Promise<void>
}

export const useCheckboxHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

  const removeCheckbox: Handlers['removeCheckbox'] = async id => {
    await supabase.from('checklist').delete().eq('id', id)
  }

  const insertCheckbox: Handlers['insertCheckbox'] = async ({
    postId,
    title
  }) => {
    if (!user) {
      throw Error('You must log in first!')
    }
    await supabase.from('checklist').insert({
      author_id: user.id,
      post_id: postId,
      title
    })
  }

  const updateCheckboxTitle: Handlers['updateCheckboxTitle'] = async (
    title,
    CheckboxId
  ) => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('checklist')
      .update({
        title
      })
      .eq('id', CheckboxId)
  }

  const updateCheckboxIsCompleted: Handlers['updateCheckboxIsCompleted'] =
    async (is_completed, CheckboxId) => {
      if (!user) {
        throw Error('You must provide a user object!')
      }
      await supabase
        .from('checklist')
        .update({
          is_completed
        })
        .eq('id', CheckboxId)
    }

  const updateAllCheckboxIsCompleted: Handlers['updateAllCheckboxIsCompleted'] =
    async (is_completed, checklist) => {
      if (!user) {
        throw Error('You must provide a user object!')
      }
      await updateAllCheckboxes({supabase, is_completed, checklist})
    }

  return {
    removeCheckbox,
    insertCheckbox,
    updateCheckboxTitle,
    updateCheckboxIsCompleted,
    updateAllCheckboxIsCompleted
  }
}

const updateAllCheckboxes = async ({
  supabase,
  is_completed,
  checklist
}: {
  supabase: SupabaseContext['supabase']
  is_completed: Checkbox['is_completed']
  checklist: ChecklistStore['state']['checklist']['data']
}): Promise<void> => {
  if (!checklist) {
    return
  }
  await Promise.all(
    checklist.map(async checklist => {
      await supabase
        .from('checklist')
        .update({
          is_completed
        })
        .eq('id', checklist.id)
    })
  )
}
