import tw from '@/components/common/tw-styled-components'
import {UserImage} from '@/components/common/user-image'
import {observer} from 'mobx-react-lite'
import {CardInfoShowData} from './card-info-show-data'
import {useCardInfoStore} from './card-info-store'

const TwUserImageWrapper = tw.div`
  flex
  flex-1
  gap-2
  items-center
  truncate
`

export const CardInfoCreator = observer(() => {
  const [cardCreatorState] = useCardInfoStore()

  return (
    <CardInfoShowData
      loading={cardCreatorState.cardCreator.loading}
      error={cardCreatorState.cardCreator.error?.message}
      data={<CreatorData />}
      prefix={'creator'}
    />
  )
})

const CreatorData = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.cardCreator.data) {
    return null
  }

  const src = state.cardCreator.data.user_metadata?.avatar_url

  return (
    <TwUserImageWrapper>
      <UserImage src={src} />
      <div className="truncate">{state.cardCreator.data.email}</div>
    </TwUserImageWrapper>
  )
})
