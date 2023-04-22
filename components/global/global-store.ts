import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoPersist} from '@/utils/mobx-utils/make-auto-persist'
import {makeAutoObservable, observable} from 'mobx'
import {Theme} from './types'

interface State {
  theme: Theme
  drawerOpen: boolean
  drawerOpenByHover: boolean
  showLeftMenuOnHover: boolean
}

export class GlobalStore {
  state: State = {
    theme: 'dark',
    drawerOpen: false,
    drawerOpenByHover: false,
    showLeftMenuOnHover: true
  }

  constructor(serverTheme: Theme | undefined) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    serverTheme && this.setTheme(serverTheme)
    makeAutoPersist(this, 'global-store')
  }

  setTheme = (theme: Theme): void => {
    this.state.theme = theme
  }

  updateTheme = (newTheme: Theme): void => {
    this.setTheme(newTheme)
  }

  setDrawerOpen = (byHoverValue = false): void => {
    this.state.drawerOpen = true
    this.state.drawerOpenByHover = byHoverValue
  }

  setDrawerToggle = (): void => {
    this.state.drawerOpen = !this.state.drawerOpen
    this.state.drawerOpenByHover = false
  }

  setDrawerClosed = (byHoverValue = false): void => {
    this.state.drawerOpen = false
    this.state.drawerOpenByHover = byHoverValue
  }

  setShowLeftMenuOnHoverToggle = (): void => {
    this.state.showLeftMenuOnHover = !this.state.showLeftMenuOnHover
  }
}

const [GlobalContext, useGlobalStore] = createUseStore<GlobalStore>()
export {GlobalContext, useGlobalStore}
