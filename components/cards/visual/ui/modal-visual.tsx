'use client'

import {CardVisualTab} from '@/components/common/drawer/drawer-tabs'
import {Modal} from '@/components/common/modal'
import {useBoolean} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'
import {useCardInfoStore} from '../../card-info/card-info-store'
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
      body={visualTab && <VisualTab />}
      classNameModalBox="container"
      classNameBody="h-[calc(100vh-100px)]"
    />
  )
})

const Header = observer(() => {
  const [cardInfoState] = useCardInfoStore()
  const view = cardInfoState.card.data?.selected_visual

  return <div className="capitalize">{view}</div>
})

const VisualTab = () => {
  const transitionFinished = useBoolean(false)

  useSetFocusAfterTransitionEnd(
    {id: 'dialog-modal-visual-tab', dep: getSearchParam('visual-tab')},
    transitionFinished.turnOn,
    () => {}
  )

  return transitionFinished.value && <CardVisualTab />
}
