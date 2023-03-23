import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoObservable, observable} from 'mobx'
import {Theme} from './types'

interface State {
  theme: Theme
}

export class GlobalStore {
  state: State = {
    theme: ''
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setTheme(theme: Theme): void {
    this.state.theme = theme
  }

  updateTheme = (newTheme: Theme) => {
    this.setTheme(newTheme)
  }
}

const [GlobalContext, useGlobalStore] = createUseStore(GlobalStore)
export {GlobalContext, useGlobalStore}
