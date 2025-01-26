import {useGlobalStore} from '@/components/global/global-store'
import {Util} from '@/utils/util'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
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
  const [state, store] = useGlobalStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const postId = searchParams.get('post')

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
      const queryString = Util.deleteQueryParam(searchParams, 'post')
      Util.routerPushQuery(router, queryString, pathname)
    } else if (state.rightDrawerOpen && state.lastPostId && !postId) {
      const queryString = Util.addQueryParam(
        searchParams,
        'post',
        state.lastPostId
      )
      Util.routerPushQuery(router, queryString, pathname)
    }
  }, [state.rightDrawerOpen])
}
