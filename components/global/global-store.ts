'use client'

import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoPersist} from '@/utils/mobx-utils/make-auto-persist'
import {makeAutoObservable, observable} from 'mobx'
import {Tab, Theme} from './types'

interface State {
  theme: Theme
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
  drawerOpenByHover: boolean
  showLeftMenuOnHover: boolean
  lastPostId: string | undefined
  rightDrawerWidth: number
  leftDrawerWidth: number
  tab: Tab
}

export class GlobalStore {
  state: State = {
    theme: 'dark',
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    drawerOpenByHover: false,
    showLeftMenuOnHover: false,
    lastPostId: undefined,
    rightDrawerWidth: 320,
    leftDrawerWidth: 320,
    tab: 'info'
  }

  constructor(serverTheme: Theme | undefined) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    makeAutoPersist(this, 'global-store')
    serverTheme && this.setTheme(serverTheme)
  }

  setRightDrawerWidth = (rightDrawerWidth: State['rightDrawerWidth']): void => {
    this.state.rightDrawerWidth = rightDrawerWidth
  }

  setLeftDrawerWidth = (leftDrawerWidth: State['leftDrawerWidth']): void => {
    this.state.leftDrawerWidth = leftDrawerWidth
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

  setTab = (tab: Tab): void => {
    this.state.tab = tab
  }
}

const [GlobalContext, useGlobalStore] = createUseStore<GlobalStore>()
export {GlobalContext, useGlobalStore}
