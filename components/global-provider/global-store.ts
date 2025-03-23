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
  lastCardId: string | undefined
  rightDrawerWidth: number
  leftDrawerWidth: number
  tab: Tab
  logging: {
    email: boolean
    github: boolean
    google: boolean
    anonymously: boolean
    logout: boolean
  }
}

export class GlobalStore {
  state: State = {
    theme: 'dark',
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    drawerOpenByHover: false,
    showLeftMenuOnHover: false,
    lastCardId: undefined,
    rightDrawerWidth: 320,
    leftDrawerWidth: 320,
    tab: 'info',
    logging: {
      email: false,
      github: false,
      google: false,
      anonymously: false,
      logout: false
    }
  }

  constructor(serverTheme: Theme | undefined) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    makeAutoPersist(this, 'global-store')
    if (serverTheme) {
      this.setTheme(serverTheme)
    }
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

  setLastCardId = (cardId: State['lastCardId']): void => {
    this.state.lastCardId = cardId
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

  setLoggingOff = (): void => {
    this.state.logging = {
      email: false,
      github: false,
      google: false,
      anonymously: false,
      logout: false
    }
  }

  setLogging = (value: keyof State['logging']): void => {
    this.state.logging = {...this.state.logging, [value]: true}
  }
}

const [GlobalContext, useGlobalStore] = createUseStore<GlobalStore>()
export {GlobalContext, useGlobalStore}
