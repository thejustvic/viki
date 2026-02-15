import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {CheckboxComponent} from '@/components/checklist/checkbox/checkbox'
import {Loader} from '@/components/common/loader'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'

export const Checklist = () => {
  return <Checkboxes />
}

const TwState = tw.div`
  flex
  justify-center
  items-center
  h-[calc(100dvh-123px)]
`

const Checkboxes = observer(() => {
  const id = String(getSearchCard())
  const [state] = useCardChecklistStore()

  if (state.checklists.error) {
    return <TwState>{state.checklists.error.message}</TwState>
  }
  if (state.checklists.loading) {
    return (
      <TwState>
        <Loader />
      </TwState>
    )
  }
  if (!state.checklists.data?.get(id)) {
    return (
      <TwState>
        <div className="text-info">type some stuff</div>
      </TwState>
    )
  }

  return (
    <PerfectScrollbar>
      <div className="flex flex-col h-[calc(100dvh-180px)]">
        {state.checklists.data?.get(id)?.map(checkbox => {
          return (
            <CheckboxComponent
              key={checkbox.id}
              id={checkbox.id}
              checked={checkbox.is_completed}
              title={checkbox.title}
            />
          )
        })}
      </div>
    </PerfectScrollbar>
  )
})
