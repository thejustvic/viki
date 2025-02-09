import {getSearchPost} from '@/app/posts/components/get-search-post'
import {usePostHandlers} from '@/app/posts/components/posts-handlers'
import {useGlobalStore} from '@/components/global/global-store'
import {useEffect} from 'react'
import {useMousePosition} from './use-mouse-position'

export const useLeftDrawerOpenState = (): void => {
  const {x} = useMousePosition()
  const [state, store] = useGlobalStore()
  const postId = getSearchPost()

  useEffect(() => {
    if (!postId) {
      return store.setLeftDrawerClosed()
    }
  }, [postId])

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
  const {addPostQueryParam, deletePostQueryParam} = usePostHandlers()
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
      deletePostQueryParam()
    } else if (state.rightDrawerOpen && state.lastPostId && !postId) {
      addPostQueryParam(state.lastPostId)
    }
  }, [state.rightDrawerOpen])
}
