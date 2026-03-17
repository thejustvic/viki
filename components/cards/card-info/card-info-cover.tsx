import {useCardHandlers} from '@/components/cards/cards-handlers'
import {getSearchCard} from '@/components/cards/get-search-card'
import tw from '@/components/common/tw-styled-components'
import {observer} from 'mobx-react-lite'
import {CardBgImages} from '../types'
import {CardInfoShowData} from './card-info-show-data'
import {useCardInfoStore} from './card-info-store'

export const CardInfoCover = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <CardInfoShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<CoverData />}
      prefix={'cover'}
    />
  )
})

const TwRadio = tw.div`
  flex
  gap-1
  items-center
  justify-between
  w-[120px]
  bg-base-200
  p-2
  rounded
  cursor-pointer
`

const bgImages: CardBgImages = ['none', 'cyborg', 'matrix', 'cyberpunk']

const CoverData = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardBgImage} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  return (
    <div className="flex flex-col gap-1">
      {bgImages.map(image => {
        return (
          <TwRadio key={image} onClick={() => updateCardBgImage(image, id)}>
            <div>{image}</div>
            <input
              disabled={!state.my}
              type="radio"
              name="radio-cover"
              className="radio"
              checked={state?.card?.data?.bg_image === image}
              readOnly
            />
          </TwRadio>
        )
      })}
    </div>
  )
})
