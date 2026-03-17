import tw from '@/components/common/tw-styled-components'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {useCardChecklistStore} from './card-checklist-store'

const TwWrapper = tw.div`
  flex
  flex-1
  gap-2
  items-center
`

const TwProgressWrapper = tw.div`
  relative
  flex-1
  h-1.5
  bg-info-content
  rounded-sm
`

interface ITwProgress {
  $isFull: boolean
}
const TwProgress = tw.div<ITwProgress>`
  ${({$isFull}) => ($isFull ? 'bg-success' : 'bg-info')}
  h-full
  rounded-sm
  min-w-2
  transition-[width]
  duration-300
`

const TwProgressText = tw.div`
  text-xs
  text-center
`

export const CardChecklistProgress = observer(({id}: {id: string}) => {
  const [state, store] = useCardChecklistStore()

  useEffect(() => {
    if (state.checklists.data?.get(id)) {
      store.setProgress(id)
    } else {
      state.progressText.delete(id)
    }
  }, [state.checklists.data])

  const progress = state.progress.get(id)
  const progressText = state.progressText.get(id)

  return (
    <TwWrapper>
      <TwProgressWrapper>
        <TwProgress
          $isFull={progress === 100}
          style={{width: (progress ?? 0) + '%'}}
        />
      </TwProgressWrapper>
      <TwProgressText>{progressText ?? '0/0'}</TwProgressText>
    </TwWrapper>
  )
})
