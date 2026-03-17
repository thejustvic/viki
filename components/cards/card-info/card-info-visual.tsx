import {observer} from 'mobx-react-lite'
import {CardInfoShowData} from './card-info-show-data'
import {useCardInfoStore} from './card-info-store'
import {VisualContent} from './visual-content/visual-content'

export const CardInfoVisual = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <CardInfoShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<VisualContent />}
      prefix={'visual'}
    />
  )
})
