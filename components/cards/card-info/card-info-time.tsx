import {format} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {CardInfoShowData} from './card-info-show-data'
import {useCardInfoStore} from './card-info-store'

export const CardInfoTime = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <CardInfoShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<TimeData />}
      prefix={'time'}
    />
  )
})

const TimeData = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.card.data) {
    return null
  }

  const time = state.card.data.created_at

  const timeDistance = format(new Date(time), 'hh:mm:ss, PPPP')

  return <div className="flex flex-1">{timeDistance}</div>
})
