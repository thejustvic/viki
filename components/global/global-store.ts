import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoPersist} from '@/utils/mobx-utils/make-auto-persist'
import {makeAutoObservable, observable} from 'mobx'
import {Theme} from './types'

interface State {
  theme: Theme
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
  drawerOpenByHover: boolean
  showLeftMenuOnHover: boolean
  lastPostId: string | undefined
}

export class GlobalStore {
  state: State = {
    theme: 'dark',
    leftDrawerOpen: true,
    rightDrawerOpen: false,
    drawerOpenByHover: false,
    showLeftMenuOnHover: true,
    lastPostId: undefined
  }

  constructor(serverTheme: Theme | undefined) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    makeAutoPersist(this, 'global-store')
    serverTheme && this.setTheme(serverTheme)
  }

  setTheme = (theme: Theme): void => {
    this.state.theme = theme
  }

  updateTheme = (newTheme: Theme): void => {
    this.setTheme(newTheme)
  }

  setLastPostId = (postId: State['lastPostId']): void => {
    this.state.lastPostId = postId
  }

  setRightDrawerToggle = (): void => {
    this.state.rightDrawerOpen = !this.state.rightDrawerOpen
  }

  setRightDrawerOpen = (): void => {
    this.state.rightDrawerOpen = true
  }

  setRightDrawerClosed = (): void => {
    this.state.rightDrawerOpen = false
  }

  setLeftDrawerOpen = (byHoverValue = false): void => {
    this.state.leftDrawerOpen = true
    this.state.drawerOpenByHover = byHoverValue
  }

  setLeftDrawerToggle = (): void => {
    this.state.leftDrawerOpen = !this.state.leftDrawerOpen
    this.state.drawerOpenByHover = false
  }

  setLeftDrawerClosed = (byHoverValue = false): void => {
    this.state.leftDrawerOpen = false
    this.state.drawerOpenByHover = byHoverValue
  }

  setShowLeftMenuOnHoverToggle = (): void => {
    this.state.showLeftMenuOnHover = !this.state.showLeftMenuOnHover
  }
}

const [GlobalContext, useGlobalStore] = createUseStore<GlobalStore>()
export {GlobalContext, useGlobalStore}
