import {Input} from '@/components/daisyui/input'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {CardVisual} from '../../types'
import {ShowData} from '../card-info'
import {useCardInfoStore} from '../card-info-store'

const TwRadio = tw.div`flex gap-1 items-center justify-between w-[90px] bg-base-300 p-2 rounded cursor-pointer`

const cardVisual: CardVisual = ['winter', 'spring']

export const VisualContent = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardVisual} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex gap-1">
        {cardVisual.map(visual => {
          return (
            <TwRadio key={visual} onClick={() => updateCardVisual(visual, id)}>
              <div>{visual}</div>
              <input
                type="radio"
                name="radio-1"
                className="radio"
                checked={state?.card?.data?.selected_visual === visual}
                readOnly
              />
            </TwRadio>
          )
        })}
      </div>
      <Content />
    </div>
  )
})

const Content = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.card.data) {
    return null
  }

  switch (state?.card?.data?.selected_visual) {
    case 'winter': {
      return <WinterContent />
    }
    case 'spring': {
      return <SpringContent />
    }
    default: {
      return 'no content here, check another type'
    }
  }
})

const SpringContent = () => {
  return 'coming soon'
}

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
        data={<ChooseBaubleColorData />}
        prefix={'bauble color:'}
      />
      <ShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={<ChooseBaubleTextColorData />}
        prefix={'text color on bauble:'}
      />
    </div>
  )
})

const ChooseBaubleColorData = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardBaubleColorCompleted, updateCardBaubleColorNotCompleted} =
    useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }
  if (
    !state.card.data.bauble_color_not_completed ||
    !state.card.data.bauble_color_completed
  ) {
    return null
  }
  return (
    <div className="flex gap-2 flex-wrap ">
      <ColorPicker
        color={state.card.data.bauble_color_not_completed}
        label="not checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleColorNotCompleted(color, id)
        }}
      />
      <ColorPicker
        color={state.card.data.bauble_color_completed}
        label="checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleColorCompleted(color, id)
        }}
      />
    </div>
  )
})

const ChooseBaubleTextColorData = observer(() => {
  const [state] = useCardInfoStore()
  const {
    updateCardBaubleTextColorCompleted,
    updateCardBaubleTextColorNotCompleted
  } = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }
  if (
    !state.card.data.bauble_text_color_not_completed ||
    !state.card.data.bauble_text_color_completed
  ) {
    return null
  }
  return (
    <div className="flex gap-2 flex-wrap ">
      <ColorPicker
        color={state.card.data.bauble_text_color_not_completed}
        label="not checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleTextColorNotCompleted(color, id)
        }}
      />
      <ColorPicker
        color={state.card.data.bauble_text_color_completed}
        label="checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleTextColorCompleted(color, id)
        }}
      />
    </div>
  )
})

const ColorPicker = ({
  color = '#ff0000',
  label = 'Color',
  onChange
}: {
  color?: string
  label?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <Input
      type="color"
      defaultValue={color}
      inputClassName="p-0 h-10 w-25 cursor-pointer"
      label={label}
      onChange={onChange}
    />
  )
}
