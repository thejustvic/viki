import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoObservable, observable} from 'mobx'
import {getPersistedStore, makePersistable} from 'mobx-persist-store'
import {Theme} from './types'

interface State {
  theme: Theme
  scrollbar: 'overlayscrollbars' | 'perfectscrollbar'
}

export class GlobalStore {
  state: State = {
    theme: 'dark',
    scrollbar: 'overlayscrollbars'
  }

  constructor(serverTheme: Theme | undefined) {
    makeAutoObservable(this, {
      state: observable.shallow
    })

    if (typeof window !== 'undefined') {
      void makePersistable(this, {
        name: 'GlobalStore',
        properties: ['state'],
        storage: window.localStorage
      })
    }

    serverTheme && this.setTheme(serverTheme)
  }

  async getStoredData(): Promise<this | null> {
    return getPersistedStore(this)
  }

  setTheme(theme: Theme): void {
    this.state.theme = theme
  }

  updateTheme(newTheme: Theme): void {
    this.setTheme(newTheme)
  }

  setScrollbar(scrollbar: State['scrollbar']): void {
    this.state.scrollbar = scrollbar
  }
}

const [GlobalContext, useGlobalStore] = createUseStore<GlobalStore>()
export {GlobalContext, useGlobalStore}
