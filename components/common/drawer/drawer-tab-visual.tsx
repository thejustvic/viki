import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {useCardInfoStore} from '@/components/cards/card-info/card-info-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {canvasContainerClasses} from '@/components/cards/visual/ui/base-scene'
import tw from '@/components/common/tw-styled-components'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Tab} from '@/components/global-provider/types'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import {Loader} from '../loader'
import {TwTab} from './drawer-tabs'

const CardVisual = dynamic(
  () => import('@/components/cards/card-visual').then(mod => mod.CardVisual),
  {ssr: false, loading: () => <CardVisualLoader />}
)

const TwLoader = tw.div`
  flex
  justify-center
  w-full
  items-center
  h-[calc(100dvh-70px)]
  text-violet-400
`

const CardVisualLoader = () => (
  <TwLoader>
    <Loader />
  </TwLoader>
)

const TwSeeModal = tw.div`
  grid
  place-items-center
`

export const DrawerTabVisual = observer(() => {
  const [state, store] = useGlobalStore()
  const active = state.tab === 'visual'
  const visualTab = getSearchParam('visual-tab')

  return (
    <>
      <TwTab
        value="visual"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Visual"
        groupName="right_drawer"
        checked={active}
      />
      {visualTab ? (
        <TwSeeModal className={canvasContainerClasses}>see modal</TwSeeModal>
      ) : (
        <>{active && !visualTab && <VisualTabContent />}</>
      )}
    </>
  )
})

const VisualTabContent = () => {
  return (
    <Tabs.TabContent>
      <div className="flex relative">
        <CardVisualTab />
      </div>
    </Tabs.TabContent>
  )
}

export const CardVisualTab = observer(() => {
  const id = String(getSearchCard())
  const [globalState] = useGlobalStore()
  const [, cardChecklistStore] = useCardChecklistStore()
  const [cardInfoState] = useCardInfoStore()

  usePersonViewToggle()

  return (
    <CardVisual
      playerSize={globalState.playerSize}
      checklist={cardChecklistStore.getAllCheckboxes(id)}
      card={cardInfoState.card.data}
      isThirdPersonView={globalState.isThirdPersonView}
      eggsCount={globalState.eggsTotalCount}
    />
  )
})

const usePersonViewToggle = () => {
  const id = String(getSearchCard())
  const [globalState, globalStore] = useGlobalStore()
  useGlobalKeyDown({
    handlers: {
      anyKey: e => {
        if (e.key.toLowerCase() === 'v' && e.shift) {
          globalStore.setThirdPersonView(!globalState.isThirdPersonView)
        }
      }
    },
    id,
    active: Boolean(id)
  })
}
