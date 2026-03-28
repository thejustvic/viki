import tw from '@/components/common/tw-styled-components'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconCircle, IconCircleCheck} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {GameModeType, PlayerSizeType} from '../../types'

import {Input} from '@/components/daisyui/input'
import {useCardChecklistStore} from '../../card-checklist/card-checklist-store'
import {pluralize} from '../../visual/utils/helpers'
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
      <ChooseGameMode />
      <ChoosePlayerSize />
      <ChooseTulipColor />
    </>
  )
}

const ChooseGameMode = observer(() => {
  const [state] = useCardInfoStore()
  return (
    <CardInfoShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<GameMode />}
      prefix={'game mode'}
      className="items-center"
    />
  )
})

interface IGameModes {
  key: GameModeType[number]
  name: string
}
const gameModes: IGameModes[] = [
  {key: 'none', name: 'not set'},
  {key: 'egg-collecting', name: 'find all eggs'}
]

const GameMode = observer(() => {
  const [state, store] = useGlobalStore()
  return (
    <div className="flex flex-col flex-1 gap-1 mb-2">
      <TwWrapper>
        {gameModes.map(({key, name}) => {
          return (
            <TwRadio key={key} onClick={() => store.setGameMode(key)}>
              <div>{name}</div>
              <input
                type="radio"
                name="radio-game-mode"
                className="radio"
                checked={state?.gameMode === key}
                readOnly
              />
            </TwRadio>
          )
        })}
      </TwWrapper>
      {state?.gameMode === 'egg-collecting' && (
        <>
          <Range />
        </>
      )}
    </div>
  )
})

const Range = observer(() => {
  const id = String(getSearchCard())
  const [, cardChecklistStore] = useCardChecklistStore()
  const [state, store] = useGlobalStore()

  const checklistCount = cardChecklistStore.getAllCheckboxes(id)?.length

  const count = state.eggsTotalCount
  const min = 1
  const max = Number(checklistCount)
  const step = 1
  return (
    <div className="flex flex-col gap-1">
      <p>How many eggs are behind the envelopes?</p>
      <Input
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={count}
        onChange={({currentTarget: {value}}) => {
          const val = Math.round(Number(value))
          store.setEggsTotalCount(val)
          store.setEggsLeftToCollect(val)
        }}
      />
      <p>
        {pluralize(count, 'egg')} behind {pluralize(max, 'envelope')}
      </p>
    </div>
  )
})

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

const playerSizes: PlayerSizeType = ['human', 'bunny']

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
