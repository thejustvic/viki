import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import {Checkbox} from './types'

interface State {
  checklist: SupabaseQuery<Checkbox[]>
  progress: number
  progressText: string
}

export class ChecklistStore {
  state: State = {
    checklist: {
      loading: false,
      data: null,
      error: null
    },
    progress: 0,
    progressText: '0/0'
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setChecklist(checklist: State['checklist']): void {
    this.state.checklist = checklist
  }

  setProgress = (): void => {
    if (!this.state.checklist.data) {
      return
    }
    this.state.progress = Math.round(
      (this.state.checklist.data.filter((s: Checkbox) => !!s && s.is_completed)
        .length /
        this.state.checklist.data.length) *
        100
    )

    const completed = (s: Checkbox): boolean => s.is_completed
    this.state.progressText =
      this.state.checklist.data.filter(completed).length +
      '/' +
      this.state.checklist.data.length
  }

  handleUpdate = (oldCheckbox: Checkbox, newCheckbox: Checkbox): void => {
    const checklist = this.state.checklist.data?.map(checkbox => {
      if (checkbox.id === oldCheckbox.id) {
        return newCheckbox
      }
      return checkbox
    })
    if (checklist) {
      this.setChecklist({
        ...this.state.checklist,
        data: checklist
      })
    }
  }

  handleInsert = (newCheckbox: Checkbox): void => {
    if (this.state.checklist.data) {
      this.setChecklist({
        ...this.state.checklist,
        data: [...this.state.checklist.data, newCheckbox]
      })
    }
  }

  handleDelete = (oldCheckbox: Checkbox): void => {
    const checklist = Util.clone(this.state.checklist.data)
    if (checklist) {
      this.setChecklist({
        ...this.state.checklist,
        data: checklist.filter(checkbox => checkbox.id !== oldCheckbox.id)
      })
    }
  }
}

const [ChecklistContext, useChecklistStore] = createUseStore<ChecklistStore>()
export {ChecklistContext, useChecklistStore}
