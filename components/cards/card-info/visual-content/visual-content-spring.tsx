import tw from '@/components/common/tw-styled-components'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconCircle, IconCircleCheck} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {PlayerSizeType} from '../../types'

import {CardInfoShowData} from '../card-info-show-data'
import {useCardInfoStore} from '../card-info-store'
import {ChooseColorData} from './visual-content'

export const VisualContentSpring = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardVisual} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  const checked = state?.card?.data?.selected_visual === 'spring'

  return (
    <>
      <Tabs.Tab
        value="spring"
        onChange={({target: {value}}) => {
          void updateCardVisual(value, id)
        }}
        label="spring"
        groupName="tabs-visual"
        checked={checked}
        icon={checked ? IconCircleCheck : IconCircle}
      />
      <Tabs.TabContent className="p-2">
        <SpringContent />
      </Tabs.TabContent>
    </>
  )
})

const SpringContent = () => {
  return (
    <>
      <ChoosePlayerSize />
      <ChooseTulipColor />
    </>
  )
}

const ChoosePlayerSize = observer(() => {
  const [state] = useCardInfoStore()
  return (
    <CardInfoShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<PlayerSize />}
      prefix={'user size'}
      className="items-center"
    />
  )
})

const TwRadio = tw.div`
  flex
  gap-1
  items-center
  justify-between
  w-[100px]
  bg-base-200
  p-2
  rounded
  cursor-pointer
`

const TwWrapper = tw.div`
  flex
  flex-1
  gap-1
  flex-wrap
`

const playerSizes: PlayerSizeType = ['human', 'cat']

const PlayerSize = observer(() => {
  const [state, store] = useGlobalStore()

  return (
    <TwWrapper>
      {playerSizes.map(playerSize => {
        return (
          <TwRadio
            key={playerSize}
            onClick={() => store.setPlayerSize(playerSize)}
          >
            <div>{playerSize}</div>
            <input
              type="radio"
              name="radio-player-size"
              className="radio"
              checked={state?.playerSize === playerSize}
              readOnly
            />
          </TwRadio>
        )
      })}
    </TwWrapper>
  )
})

const ChooseTulipColor = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <div className="flex mt-4 gap-2 flex-col">
      <CardInfoShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="tulip_color_completed"
            colorNotCompleted="tulip_color_not_completed"
          />
        }
        prefix={'tulip color'}
        className="items-center"
      />
      <CardInfoShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="tulip_plate_color_completed"
            colorNotCompleted="tulip_plate_color_not_completed"
          />
        }
        prefix={'envelope color'}
        className="items-center"
      />
      <CardInfoShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="tulip_plate_text_color_completed"
            colorNotCompleted="tulip_plate_text_color_not_completed"
          />
        }
        prefix={'color of text on envelope'}
        className="items-center"
      />
    </div>
  )
})
