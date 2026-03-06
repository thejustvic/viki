import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {twJoin} from 'tailwind-merge'
import {useCardChecklistStore} from './card-checklist-store'

export const CardChecklistProgress = observer(({id}: {id: string}) => {
  const [state, store] = useCardChecklistStore()

  useEffect(() => {
    if (state.checklists.data?.get(id)) {
      store.setProgress(id)
    } else {
      state.progressText.delete(id)
    }
  }, [state.checklists.data])

  return (
    <div className="flex flex-1 gap-2 items-center">
      <div className="relative flex-1 h-1.5 bg-info-content rounded-sm">
        <div
          className={twJoin(
            'h-full rounded-sm min-w-2 transition-[width] duration-300',
            state.progress.get(id) === 100 ? 'bg-success' : 'bg-info'
          )}
          style={{width: (state.progress.get(id) ?? 0) + '%'}}
        />
      </div>
      <div className={twJoin('text-xs text-center')}>
        {state.progressText.get(id) ?? '0/0'}
      </div>
    </div>
  )
})
