import {Button} from '@/components/daisyui/button'
import {Textarea} from '@/components/daisyui/textarea'
import {IconCancel, IconCheck, IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useState} from 'react'
import {CheckboxProps} from './checkbox'
import {useCheckboxHandlers} from './checkbox-handlers'
import {useCheckboxStore} from './checkbox-store'

export const CheckboxEdit = observer(
  ({checkbox: {id, title}}: CheckboxProps) => {
    const [state, store] = useCheckboxStore()
    const [value, setValue] = useState(state.unsavedTitle || title || '')
    const {updateCheckboxTitle, removeCheckbox} = useCheckboxHandlers()

    return (
      <div className="flex gap-2 flex-col mx-9 my-1">
        <Textarea
          className="w-full min-h-10 h-10"
          onBlur={e => store.blurEditing(e.target.value, title)}
          value={state.unsavedTitle || value}
          onChange={e => setValue(e.target.value)}
          onFocus={event => {
            const position = value.length
            event.target.setSelectionRange(position, position)
            event.target.style.height = event.target.scrollHeight + 'px'
          }}
          autoFocus
        />
        <div className="flex gap-1">
          <Button
            soft
            color="info"
            shape="circle"
            size="xs"
            onMouseDown={async () => {
              await updateCheckboxTitle(value, id)
              store.submitEditing()
            }}
          >
            <IconCheck />
          </Button>
          <Button
            soft
            size="xs"
            shape="circle"
            onMouseDown={store.cancelEditing}
          >
            <IconCancel />
          </Button>
          <Button
            soft
            color="error"
            size="xs"
            shape="circle"
            onMouseDown={async () => {
              await removeCheckbox(id)
              store.delete()
            }}
          >
            <IconTrash />
          </Button>
        </div>
      </div>
    )
  }
)
