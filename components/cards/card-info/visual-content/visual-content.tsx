import tw from '@/components/common/tw-styled-components'
import {Input} from '@/components/daisyui/input'
import {Tabs} from '@/components/daisyui/tabs'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {Card} from '../../types'
import {useCardInfoStore} from '../card-info-store'
import {VisualContentSpring} from './visual-content-spring'
import {VisualContentWinter} from './visual-content-winter'

const TwVisualContent = tw(Tabs)`
  flex
  justify-around
  h-full
  flex-1
`

export const VisualContent = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.card.data) {
    return null
  }

  return (
    <TwVisualContent>
      <VisualContentWinter />
      <VisualContentSpring />
    </TwVisualContent>
  )
})

const TwColorPickerWrapper = tw.div`
  flex
  gap-2
  flex-wrap
  flex-1
`

export const ChooseColorData = observer(
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
      <TwColorPickerWrapper>
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
      </TwColorPickerWrapper>
    )
  }
)

const TwColorPickerInput = tw(Input)`
  p-0
  h-10
  w-25
  cursor-pointer
`

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
      <TwColorPickerInput
        disabled={!state.my}
        type="color"
        defaultValue={color}
        label={label}
        onBlur={onBlur}
      />
    )
  }
)
