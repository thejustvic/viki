import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {ObjUtil} from '@/utils/obj-util'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import {Checkbox} from './types'

interface State {
  checklists: SupabaseQuery<Record<string, Checkbox[]>>
  progress: Record<string, number>
  progressText: Record<string, string>
}

export class PostChecklistStore {
  state: State = {
    checklists: {
      loading: false,
      data: null,
      error: null
    },
    progress: {},
    progressText: {}
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.deep
    })
  }

  setChecklists(checklist: State['checklists']): void {
    this.state.checklists = checklist
  }

  setProgress = (id: string): void => {
    const data = this.state.checklists.data?.[id]
    if (!Array.isArray(data)) {
      console.error('Expected an array, but found:', data)
      return
    }
    if (!data) {
      return
    }
    this.state.progress[id] = Math.round(
      (data.filter((s: Checkbox) => !!s && s.is_completed).length /
        data.length) *
        100
    )
    const completed = (s: Checkbox): boolean => s.is_completed
    this.state.progressText[id] =
      data.filter(completed).length + '/' + data.length
  }

  handleUpdate = (
    id: string,
    oldCheckbox: Checkbox,
    newCheckbox: Checkbox
  ): void => {
    const checklist = this.state.checklists.data?.[id]?.map(checkbox => {
      if (checkbox.id === oldCheckbox.id) {
        return newCheckbox
      }
      return checkbox
    })
    if (checklist) {
      this.setChecklists({
        ...this.state.checklists,
        data: {...this.state.checklists.data, [id]: checklist}
      })
    }
  }

  handleInsert = (postId: string, newCheckbox: Checkbox): void => {
    if (this.state.checklists.data?.[postId]) {
      this.setChecklists({
        ...this.state.checklists,
        data: {
          ...this.state.checklists.data,
          [postId]: [...this.state.checklists.data[postId], newCheckbox]
        }
      })
    }
  }

  handleDelete = (oldCheckbox: Checkbox): void => {
    if (!this.state.checklists.data) {
      return
    }
    const checkboxId = oldCheckbox.id
    const checkboxPostId = ObjUtil.findInGroupedData(
      this.state.checklists.data,
      'id',
      checkboxId
    )?.post_id
    if (!checkboxPostId) {
      return
    }
    const checklist = Util.clone(this.state.checklists.data?.[checkboxPostId])
    if (checklist) {
      this.setChecklists({
        ...this.state.checklists,
        data: {
          ...this.state.checklists.data,
          [checkboxPostId]: checklist.filter(
            checkbox => checkbox.id !== checkboxId
          )
        }
      })
    }
  }
}

const [PostChecklistContext, usePostChecklistStore] =
  createUseStore<PostChecklistStore>()
export {PostChecklistContext, usePostChecklistStore}
