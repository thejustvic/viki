import {Button} from '@/components/daisyui/button'
import {Textarea} from '@/components/daisyui/textarea'
import {IconCancel, IconCheck, IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useState} from 'react'
import {CheckboxProps} from './checkbox'
import {useCheckboxHandlers} from './checkbox-handlers'
import {useCheckboxStore} from './checkbox-store'

export const CheckboxEdit = observer(({title, id}: CheckboxProps) => {
  const [state, store] = useCheckboxStore()
  const [value, setValue] = useState(state.unsavedTitle || title || '')
  const {updateCheckboxTitle, removeCheckbox} = useCheckboxHandlers()

  return (
    <div className="flex gap-2 flex-col">
      <Textarea
        className="w-full min-h-10 h-10"
        onBlur={e => store.blurEditing(e.target.value, title)}
        value={state.unsavedTitle || value}
        onChange={e => setValue(e.target.value)}
        onFocus={event => {
          const position = value.length
          event.target.setSelectionRange(position, position)
        }}
        autoFocus
      />
      <div className="flex gap-2 m-2">
        <Button
          shape="circle"
          size="xs"
          className="btn-soft btn-success"
          onMouseDown={async () => {
            await updateCheckboxTitle(value, id)
            store.submitEditing()
          }}
        >
          <IconCheck />
        </Button>
        <Button
          size="xs"
          shape="circle"
          className="btn-soft"
          onMouseDown={store.cancelEditing}
        >
          <IconCancel />
        </Button>
        <Button
          size="xs"
          shape="circle"
          className="btn-soft btn-error"
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
})
