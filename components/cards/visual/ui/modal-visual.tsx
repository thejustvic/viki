'use client'

import {CardVisualTab} from '@/components/common/drawer/drawer-tab-visual'
import {Modal} from '@/components/common/modal'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useBoolean} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useCallback, useEffect} from 'react'
import {useSetFocusAfterTransitionEnd} from '../../modal-card/use-set-focus-after-transitionend'

export const ModalVisualTab = observer(() => {
  const updateSearchParams = useUpdateSearchParams()
  const visualTab = getSearchParam('visual-tab')

  const goBack = useCallback(() => {
    if (visualTab) {
      updateSearchParams('visual-tab')
    }
  }, [visualTab, updateSearchParams])

  return (
    <Modal
      id="modal-visual-tab"
      open={Boolean(visualTab)}
      goBack={goBack}
      header={<Header />}
      body={Boolean(visualTab) && <VisualTab />}
      classNameModalBox="container"
      classNameBody="h-[calc(100vh-100px)]"
    />
  )
})

const Header = observer(() => {
  const [{selectedVisualMode}] = useGlobalStore()

  return <div className="capitalize">{selectedVisualMode}</div>
})

const VisualTab = observer(() => {
  const [state] = useGlobalStore()
  const transitionFinished = useBoolean(false)

  const visualTab = getSearchParam('visual-tab')

  useSetFocusAfterTransitionEnd(
    {id: 'dialog-modal-visual-tab', dep: visualTab},
    () => state.isVisualModalFromRightDrawerOpen && transitionFinished.turnOn(),
    () => {}
  )

  // loaded URL with modal-visual-tab parameter
  useEffect(() => {
    if (
      Boolean(visualTab) &&
      !transitionFinished.value &&
      !state.isVisualModalFromRightDrawerOpen
    ) {
      transitionFinished.turnOn()
    }
  }, [visualTab])

  return transitionFinished.value && <CardVisualTab />
})
