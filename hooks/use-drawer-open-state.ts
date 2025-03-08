import {getSearchPost} from '@/app/posts/components/get-search-post'
import {useGlobalStore} from '@/components/global/global-store'
import {useEffect} from 'react'
import {useMousePosition} from './use-mouse-position'
import {useUpdateSearchParams} from './use-update-search-params'

export const useLeftDrawerOpenState = (): void => {
  const {x} = useMousePosition()
  const [state, store] = useGlobalStore()
  const postId = getSearchPost()

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
      postId &&
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
  const postId = getSearchPost()

  useEffect(() => {
    if (postId) {
      store.setLastPostId(postId)
      store.setRightDrawerOpen()
    } else {
      store.setRightDrawerClosed()
    }
  }, [postId])

  useEffect(() => {
    if (!state.rightDrawerOpen && postId) {
      store.setLastPostId(postId)
      updateSearchParams('post')
    } else if (state.rightDrawerOpen && state.lastPostId && !postId) {
      updateSearchParams('post', state.lastPostId)
    }
  }, [state.rightDrawerOpen])
}
