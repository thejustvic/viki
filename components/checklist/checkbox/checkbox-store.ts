import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoObservable, observable} from 'mobx'

interface State {
  editing: boolean
  unsavedTitle: string | null
}

export class CheckboxStore {
  state: State = {
    editing: false,
    unsavedTitle: null
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  startEditing = (): void => {
    this.state.editing = true
  }

  submitEditing = (): void => {
    this.state.unsavedTitle = null
    this.state.editing = false
  }

  cancelEditing = (): void => {
    this.state.unsavedTitle = null
    this.state.editing = false
  }

  blurEditing = (textEdit: string, title: string): void => {
    if (!this.state.editing) {
      return
    }
    const text = textEdit.trim()
    if (text) {
      if (title !== text) {
        this.state.unsavedTitle = text
      } else {
        this.state.unsavedTitle = null
      }
    } else {
      this.delete()
    }
    this.state.editing = false
  }

  delete = (): void => {
    this.state.editing = false
  }
}

export const [CheckboxContext, useCheckboxStore] =
  createUseStore<CheckboxStore>()
