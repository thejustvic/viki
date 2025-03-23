import {getSearchCard} from '@/components/cards/get-search-card'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useEffect} from 'react'
import {useMousePosition} from './use-mouse-position'
import {useUpdateSearchParams} from './use-update-search-params'

export const useLeftDrawerOpenState = (): void => {
  const {x} = useMousePosition()
  const [state, store] = useGlobalStore()
  const cardId = getSearchCard()

  useEffect(() => {
    if (x === null) {
      return
    }
    if (!state.showLeftMenuOnHover) {
      return
    }
    if (
      !state.leftDrawerOpen &&
      !state.drawerOpenByHover &&
      cardId &&
      Number(x) < 10
    ) {
      store.setLeftDrawerOpen(true)
    }
    if (
      state.leftDrawerOpen &&
      state.drawerOpenByHover &&
      Number(x) > state.leftDrawerWidth + 40
    ) {
      store.setLeftDrawerClosed(false)
    }
  }, [x])
}

export const useRightDrawerOpenState = (): void => {
  const [state, store] = useGlobalStore()
  const updateSearchParams = useUpdateSearchParams()
  const cardId = getSearchCard()

  useEffect(() => {
    if (cardId) {
      store.setLastCardId(cardId)
      store.setRightDrawerOpen()
    } else {
      store.setRightDrawerClosed()
      store.setLeftDrawerClosed()
    }
  }, [cardId])

  useEffect(() => {
    if (!state.rightDrawerOpen && cardId) {
      store.setLastCardId(cardId)
      updateSearchParams('card')
    } else if (state.rightDrawerOpen && state.lastCardId && !cardId) {
      updateSearchParams('card', state.lastCardId)
    }
  }, [state.rightDrawerOpen])
}
