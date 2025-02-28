import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {twJoin} from 'tailwind-merge'
import {useChecklistStore} from './checklist-store'

export const ChecklistProgress = observer(() => {
  const [state, store] = useChecklistStore()

  useEffect(() => {
    store.setProgress()
  }, [state.checklist.data])

  return (
    <div className="flex w-full items-center">
      <div className="flex-1 bg-info-content h-[6px] relative my-[8px] rounded-sm">
        <div
          className={twJoin(
            'h-full rounded-sm min-w-[8px] transition-[width] duration-300',
            state.progress === 100 ? 'bg-success' : 'bg-info'
          )}
          style={{width: state.progress + '%'}}
        />
      </div>
      <div className={twJoin('w-[48px] text-xs text-center')}>
        {state.progressText}
      </div>
    </div>
  )
})
