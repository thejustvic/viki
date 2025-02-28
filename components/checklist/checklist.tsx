import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'
import {Loader} from '../common/loader'
import {PerfectScrollbar} from '../common/perfect-scrollbar'
import {CheckboxComponent} from './checkbox/checkbox'
import {useChecklistStore} from './checklist-store'

export const Checklist = observer(() => {
  const [scrollEl, setScrollEl] = useState<HTMLElement>()
  const [state] = useChecklistStore()

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }, [state.checklist, scrollEl])

  return (
    <PerfectScrollbar className="px-4" containerRef={setScrollEl}>
      <div className="flex flex-col gap-2 h-[24px]">
        <Checkboxes />
      </div>
    </PerfectScrollbar>
  )
})

const TwState = tw.div`
  flex
  justify-center
`

const Checkboxes = observer(() => {
  const [state] = useChecklistStore()

  if (state.checklist.error) {
    return <TwState>{state.checklist.error.message}</TwState>
  }
  if (state.checklist.loading) {
    return (
      <TwState>
        <Loader />
      </TwState>
    )
  }

  return state.checklist.data?.map(checkbox => {
    return (
      <CheckboxComponent
        key={checkbox.id}
        id={checkbox.id}
        checked={checkbox.is_completed}
        title={checkbox.title}
      />
    )
  })
})
