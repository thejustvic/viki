'use client'

import {Checkbox} from '@/components/checklist/types'
import {minDrawerWidth} from '@/utils/const'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoPersist} from '@/utils/mobx-utils/make-auto-persist'
import {ObjUtil} from '@/utils/obj-util'
import {makeAutoObservable, observable} from 'mobx'
import {isMobile} from 'react-device-detect'
import {Card, GameModeType, PlayerSizeType} from '../cards/types'
import {AuthTabGroup, Tab, Theme} from './types'

interface State {
  theme: Theme
  authTabGroup: AuthTabGroup
  draggingCard: Card | undefined
  draggingCheckbox: Checkbox | undefined
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
  drawerOpenByHover: boolean
  showLeftMenuOnHover: boolean
  lastCardId: string | undefined
  navbarWidth: number | undefined
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
  isThirdPersonView: boolean
  gameMode: GameModeType[number]
  playerSize: PlayerSizeType[number]
  isVisualModalFromRightDrawerOpen?: boolean
  eggsTotalCount: number
  eggsLeftToCollect: number
  is3DSceneLocked: boolean
}

export class GlobalStore {
  state: State = {
    theme: 'dark',
    authTabGroup: 'authProviders',
    draggingCard: undefined,
    draggingCheckbox: undefined,
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    drawerOpenByHover: false,
    showLeftMenuOnHover: true,
    lastCardId: undefined,
    navbarWidth: undefined,
    rightDrawerWidth: minDrawerWidth,
    leftDrawerWidth: minDrawerWidth,
    tab: 'info',
    logging: {
      email: false,
      github: false,
      google: false,
      anonymously: false,
      logout: false
    },
    isThirdPersonView: false,
    gameMode: 'none',
    playerSize: 'human',
    isVisualModalFromRightDrawerOpen: false,
    eggsTotalCount: 0,
    eggsLeftToCollect: 0,
    is3DSceneLocked: isMobile ? false : true
  }

  constructor(serverTheme: Theme | undefined) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    makeAutoPersist(this, 'global-store')
    if (serverTheme) {
      this.setTheme(serverTheme)
    }
    this.setVisualModalFromRightDrawerOpen(false)
    this.setIs3DSceneLocked(isMobile ? false : true)
  }

  setAuthTabGroup = (value: AuthTabGroup): void => {
    this.state.authTabGroup = value
  }

  setVisualModalFromRightDrawerOpen = (value: boolean): void => {
    this.state.isVisualModalFromRightDrawerOpen = value
  }

  setThirdPersonView = (value: boolean): void => {
    this.state.isThirdPersonView = value
  }

  setGameMode = (gameMode: GameModeType[number]): void => {
    this.state.gameMode = gameMode
  }

  setPlayerSize = (playerSize: PlayerSizeType[number]): void => {
    this.state.playerSize = playerSize
  }

  setNavbarWidth = (navbarWidth: State['navbarWidth']): void => {
    this.state.navbarWidth = navbarWidth
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

  updateDraggingCard = (value: Card | undefined): void => {
    this.state.draggingCard = value
  }

  updateDraggingCheckbox = (value: Checkbox | undefined): void => {
    this.state.draggingCheckbox = value
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

  setEggsTotalCount = (value: number): void => {
    this.state.eggsTotalCount = value
  }

  setEggsLeftToCollect = (value: number): void => {
    this.state.eggsLeftToCollect = value
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

  checkIfSomeLoad = (): boolean => {
    return ObjUtil.values(this.state.logging).some(e => e === true)
  }

  setIs3DSceneLocked = (value: boolean): void => {
    this.state.is3DSceneLocked = value
  }
}

const [GlobalContext, useGlobalStore] = createUseStore<GlobalStore>()
export {GlobalContext, useGlobalStore}
