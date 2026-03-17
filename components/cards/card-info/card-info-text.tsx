import {useCardHandlers} from '@/components/cards/cards-handlers'
import tw from '@/components/common/tw-styled-components'
import {Textarea} from '@/components/daisyui/textarea'
import {useDebouncedValue} from '@/hooks/use-debounced-value'
import {useInput} from '@/hooks/use-input'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {CardInfoShowData, TwLoading} from './card-info-show-data'
import {useCardInfoStore} from './card-info-store'

const TwLoadingTextarea = tw(TwLoading)`
  absolute
  transform
  -translate-x-1/2
  -translate-y-2/3
  top-1/2
  left-1/2
`

export const CardInfoText = observer(() => {
  const [state] = useCardInfoStore()
  return (
    <CardInfoShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<TextData />}
      prefix={'content'}
    />
  )
})

const TextData = observer(() => {
  const {updateCard} = useCardHandlers()
  const [state] = useCardInfoStore()
  const [text, onChange] = useInput(state.card.data?.text ?? '')
  const debounced = useDebouncedValue(text, 5000)

  useEffect(() => {
    const text = state.card.data?.text
    const id = state.card.data?.id
    if (id && text !== debounced && debounced.length > 0) {
      void updateCard(debounced, id)
    }
  }, [debounced])

  if (state.card.loading) {
    return (
      <div className="relative w-full">
        <Textarea
          textareaId={'card-info-empty'}
          size="md"
          value={''}
          className="w-full"
          onChange={() => {}}
        />
        <TwLoadingTextarea />
      </div>
    )
  }

  return (
    <div className="flex-1">
      <Textarea
        textareaId={'card-info-text'}
        size="md"
        value={text}
        onChange={onChange}
        onBlur={async () => {
          const id = state.card.data?.id
          if (id && text.length > 0) {
            await updateCard(text, id)
          }
        }}
        className="w-full"
        disable={!state.my}
      />
    </div>
  )
})
