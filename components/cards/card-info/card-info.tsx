import {getSearchCard} from '@/components/cards/get-search-card'
import {SimpleScrollbar} from '@/components/common/simple-scrollbar'
import tw from '@/components/common/tw-styled-components'
import {Menu} from '@/components/daisyui/menu'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {CardInfoCover} from './card-info-cover'
import {CardInfoCreator} from './card-info-creator'
import {useCardInfoStore} from './card-info-store'
import {CardInfoText} from './card-info-text'
import {CardInfoTime} from './card-info-time'
import {CardInfoVisual} from './card-info-visual'
import {useCardInfoListener} from './fetch/use-card-info-listener'

const TwMenu = tw(Menu)`
  flex-nowrap
  relative
  w-full
  p-3
`

const TwCardInfoBodyWrapper = tw.div`
  h-[calc(100dvh-74px)]
`

const TwCardInfoWrapper = tw.div`
  flex
  flex-col
  gap-2
`

export const CardInfo = observer(() => {
  const {supabase, user} = useSupabase()
  const [, store] = useCardInfoStore()
  const [, globalStore] = useGlobalStore()
  const cardId = getSearchCard()

  useCardInfoListener({
    cardId,
    store,
    globalStore,
    supabase,
    user
  })

  return (
    <TwCardInfoBodyWrapper>
      <SimpleScrollbar>
        <TwMenu>
          <TwCardInfoWrapper>
            <CardInfoCreator />
            <CardInfoTime />
            <CardInfoText />
            <CardInfoCover />
            <CardInfoVisual />
          </TwCardInfoWrapper>
        </TwMenu>
      </SimpleScrollbar>
    </TwCardInfoBodyWrapper>
  )
})
