import {CheckboxEdit} from '@/components/checklist/checkbox/checkbox-edit'
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {
  CheckboxContext,
  CheckboxStore,
  useCheckboxStore
} from '@/components/checklist/checkbox/checkbox-store'
import {Checkbox} from '@/components/checklist/types'
import {Button} from '@/components/daisyui/button'
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
  const [state, store] = useCheckboxStore()

  const {updateCheckboxIsCompleted} = useCheckboxHandlers()

  if (state.editing) {
    return <CheckboxEdit {...props} />
  }

  return (
    <>
      <label className="fieldset-label py-2 px-4 rounded-box hover:bg-accent/20">
        <input
          type="checkbox"
          checked={is_completed}
          className="checkbox"
          onChange={() => updateCheckboxIsCompleted(!is_completed, id)}
        />
        <div
          className={twJoin('flex-1', is_completed && 'line-through')}
          onClick={store.startEditing}
        >
          <span className="break-words">{title}</span>
        </div>
        {!is_completed && (
          <DragCheckboxButton
            dragListeners={dragListeners}
            dragAttributes={dragAttributes}
          />
        )}
      </label>
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
  dragAttributes?: DraggableAttributes
  dragListeners: SyntheticListenerMap | undefined
}

const DragCheckboxButton = ({
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
