import {CheckboxEdit} from '@/components/checklist/checkbox/checkbox-edit'
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {
  CheckboxContext,
  CheckboxStore,
  useCheckboxStore
} from '@/components/checklist/checkbox/checkbox-store'
import {Checkbox} from '@/components/checklist/types'
import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {DraggableAttributes} from '@dnd-kit/core'
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {IconGripVertical} from '@tabler/icons-react'
import {observer, useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

export interface CheckboxProps extends PropsWithChildren {
  checkbox: Checkbox
  dragListeners?: SyntheticListenerMap | undefined
  dragAttributes?: DraggableAttributes
}

const CheckboxBase = observer((props: CheckboxProps) => {
  const {
    checkbox: {id, title, is_completed},
    dragListeners,
    dragAttributes
  } = props
  const [globalState] = useGlobalStore()
  const [state, store] = useCheckboxStore()

  const {updateCheckboxIsCompleted} = useCheckboxHandlers()

  if (state.editing) {
    return <CheckboxEdit {...props} />
  }

  return (
    <>
      <div className="flex items-center gap-3 py-1 px-3 rounded-box hover:bg-accent/20">
        <input
          type="checkbox"
          checked={is_completed}
          className="checkbox"
          onChange={() => updateCheckboxIsCompleted(!is_completed, id)}
        />
        <div className="flex-1" onClick={store.startEditing}>
          <span className="break-words text-base-content/60">{title}</span>
        </div>
        {!is_completed && (
          <DragCheckboxButton
            isDragging={Boolean(globalState.draggingCheckbox)}
            dragListeners={dragListeners}
            dragAttributes={dragAttributes}
          />
        )}
      </div>
      {state.unsavedTitle && (
        <div className="text-accent text-xs m-2 px-10">
          You didn't save last changes.{' '}
          <span className="link" onClick={store.startEditing}>
            See changes
          </span>{' '}
          or{' '}
          <span className="link" onClick={store.cancelEditing}>
            Discard
          </span>
          ?
        </div>
      )}
    </>
  )
})

interface DragCheckboxButtonProps {
  isDragging?: boolean
  dragAttributes?: DraggableAttributes
  dragListeners: SyntheticListenerMap | undefined
}

const DragCheckboxButton = ({
  isDragging,
  dragAttributes,
  dragListeners
}: DragCheckboxButtonProps) => {
  return (
    <Button
      {...dragAttributes}
      {...dragListeners}
      soft
      shape="square"
      size="sm"
      className={twJoin(isDragging && 'cursor-grabbing')}
    >
      <IconGripVertical size={14} />
    </Button>
  )
}

export const CheckboxComponent = (props: CheckboxProps) => {
  const store = useLocalObservable(() => new CheckboxStore())

  return (
    <CheckboxContext.Provider value={store}>
      <CheckboxBase {...props} />
    </CheckboxContext.Provider>
  )
}
