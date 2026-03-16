import tw from '@/components/common/tw-styled-components'
import {Input} from '@/components/daisyui/input'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconCircle, IconCircleCheck} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {Card, PlayerSizeType} from '../../types'
import {ShowData} from '../card-info'
import {useCardInfoStore} from '../card-info-store'

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

const VisualContentWinter = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardVisual} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  const checked = state?.card?.data?.selected_visual === 'winter'

  return (
    <>
      <Tabs.Tab
        value="winter"
        onChange={({target: {value}}) => {
          void updateCardVisual(value, id)
        }}
        label="winter"
        groupName="tabs-visual"
        checked={checked}
        icon={checked ? IconCircleCheck : IconCircle}
      />
      <Tabs.TabContent className="p-2">
        <WinterContent />
      </Tabs.TabContent>
    </>
  )
})

const VisualContentSpring = observer(() => {
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

export const VisualContent = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.card.data) {
    return null
  }

  return (
    <Tabs className="flex justify-around h-full flex-1">
      <VisualContentWinter />
      <VisualContentSpring />
    </Tabs>
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
    <ShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<PlayerSize />}
      prefix={'user size'}
      className="items-center"
    />
  )
})

const playerSizes: PlayerSizeType = ['human', 'mouse']

const PlayerSize = observer(() => {
  const [state, store] = useGlobalStore()

  return (
    <div className="flex flex-1 gap-1 flex-wrap">
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
    </div>
  )
})

const ChooseTulipColor = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <div className="flex mt-4 gap-2 flex-col">
      <ShowData
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
      <ShowData
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
      <ShowData
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

const WinterContent = () => {
  return <ChooseBaubleColor />
}

const ChooseBaubleColor = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <div className="mt-4 flex flex-col gap-2">
      <ShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="bauble_color_completed"
            colorNotCompleted="bauble_color_not_completed"
          />
        }
        prefix={'bauble color'}
        className="items-center"
      />
      <ShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="bauble_text_color_completed"
            colorNotCompleted="bauble_text_color_not_completed"
          />
        }
        prefix={'color of text on bauble'}
        className="items-center"
      />
    </div>
  )
})

const ChooseColorData = observer(
  ({
    colorCompleted,
    colorNotCompleted
  }: {
    colorCompleted: keyof Card
    colorNotCompleted: keyof Card
  }) => {
    const [state] = useCardInfoStore()
    const {updateColor} = useCardHandlers()
    const id = String(getSearchCard())

    if (!state.card.data) {
      return null
    }
    if (
      !state.card.data[colorNotCompleted] ||
      !state.card.data[colorCompleted]
    ) {
      return null
    }
    return (
      <div className="flex gap-2 flex-wrap flex-1">
        <ColorPicker
          color={state.card.data[colorNotCompleted]}
          label="not checked"
          onBlur={async e => {
            const color = e.target.value
            await updateColor(id, colorNotCompleted, color)
          }}
        />
        <ColorPicker
          color={state.card.data[colorCompleted]}
          label="checked"
          onBlur={async e => {
            const color = e.target.value
            await updateColor(id, colorCompleted, color)
          }}
        />
      </div>
    )
  }
)

const ColorPicker = observer(
  ({
    color = '#ff0000',
    label = 'Color',
    onBlur
  }: {
    color?: string
    label?: string
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  }) => {
    const [state] = useCardInfoStore()
    return (
      <Input
        disabled={!state.my}
        type="color"
        defaultValue={color}
        inputClassName="p-0 h-10 w-25 cursor-pointer"
        label={label}
        onBlur={onBlur}
      />
    )
  }
)
