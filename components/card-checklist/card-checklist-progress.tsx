import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {twJoin} from 'tailwind-merge'
import {useCardChecklistStore} from './card-checklist-store'

export const CardChecklistProgress = observer(({id}: {id: string}) => {
  const [state, store] = useCardChecklistStore()

  useEffect(() => {
    if (state.checklists.data?.get(id)) {
      store.setProgress(id)
    }
  }, [state.checklists.data])

  return (
    <div className="flex w-full items-center">
      <div className="flex-1 bg-info-content h-[6px] relative my-[8px] rounded-sm">
        <div
          className={twJoin(
            'h-full rounded-sm min-w-[8px] transition-[width] duration-300',
            state.progress.get(id) === 100 ? 'bg-success' : 'bg-info'
          )}
          style={{width: (state.progress.get(id) ?? 0) + '%'}}
        />
      </div>
      <div className={twJoin('w-[48px] text-xs text-center')}>
        {state.progressText.get(id) ?? '0/0'}
      </div>
    </div>
  )
})
