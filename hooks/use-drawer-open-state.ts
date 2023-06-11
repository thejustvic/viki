import {useGlobalStore} from '@/components/global/global-store'
import {useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {useMousePosition} from './use-mouse-position'

export const useLeftDrawerOpenState = (): void => {
  const {x} = useMousePosition()
  const [state, store] = useGlobalStore()

  useEffect(() => {
    if (x === null) {
      return
    }
    if (!state.showLeftMenuOnHover) {
      return
    }
    if (!state.leftDrawerOpen && !state.drawerOpenByHover && Number(x) < 10) {
      store.setLeftDrawerOpen(true)
    }
    if (state.leftDrawerOpen && state.drawerOpenByHover && Number(x) > 400) {
      store.setLeftDrawerClosed(false)
    }
  }, [x])
}

export const useRightDrawerOpenState = (): void => {
  const [, store] = useGlobalStore()
  const searchParams = useSearchParams()
  const postId = searchParams.get('post')

  useEffect(() => {
    if (postId) {
      store.setLastPostId(postId)
      store.setRightDrawerOpen()
    } else {
      store.setRightDrawerClosed()
    }
  }, [postId])
}
