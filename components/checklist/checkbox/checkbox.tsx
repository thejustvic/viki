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
  checked: Checkbox['is_completed']
  id: Checkbox['id']
  title: Checkbox['title']
  dragListeners?: SyntheticListenerMap | undefined
  dragAttributes?: DraggableAttributes
}

const CheckboxBase = observer((props: CheckboxProps) => {
  const [state, store] = useCheckboxStore()

  const {updateCheckboxIsCompleted} = useCheckboxHandlers()

  if (state.editing) {
    return <CheckboxEdit {...props} />
  }

  return (
    <>
      <label className="fieldset-label py-2 px-4 rounded-box hover:bg-accent/20">
        {!props.checked && (
          <DragCheckboxButton
            dragListeners={props.dragListeners}
            dragAttributes={props.dragAttributes}
          />
        )}

        <input
          type="checkbox"
          checked={props.checked}
          className="checkbox"
          onChange={() => updateCheckboxIsCompleted(!props.checked, props.id)}
        />
        <div
          className={twJoin(props.checked && 'line-through')}
          onClick={store.startEditing}
        >
          <span className="break-words">{props.title}</span>
        </div>
      </label>

      {state.unsavedTitle && (
        <div className="text-accent text-xs m-2">
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
      shape="circle"
      size="sm"
    >
      <IconGripVertical size={12} />
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
