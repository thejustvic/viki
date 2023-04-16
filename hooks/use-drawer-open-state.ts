import {useGlobalStore} from '@/components/global/global-store'
import {useEffect} from 'react'
import {useMousePosition} from './use-mouse-position'

export const useDrawerOpenState = (): void => {
  const {x} = useMousePosition()
  const [state, store] = useGlobalStore()

  useEffect(() => {
    if (x === null) {
      return
    }
    if (!state.showLeftMenuOnHover) {
      return
    }
    if (!state.drawerOpen && !state.drawerOpenByHover && Number(x) < 10) {
      store.setDrawerOpen(true)
    }
    if (state.drawerOpen && state.drawerOpenByHover && Number(x) > 400) {
      store.setDrawerClosed(false)
    }
  }, [x])
}
