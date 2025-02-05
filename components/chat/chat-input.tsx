import {IconSend} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'
import tw from 'tailwind-styled-components'
import {Button} from '../daisyui/button'
import {Form} from '../daisyui/form'
import {Input} from '../daisyui/input'
import {useChatHandlers} from './chat-handlers'

const TwInput = tw(Input)`
  flex-1 
  flex-shrink
  mb-2
`

interface FormInputs {
  text: string
}

export const ChatInput = observer(() => {
  const {insertMessage} = useChatHandlers()
  const {register, handleSubmit, setValue} = useForm<FormInputs>()

  const onSubmit = async (data: FormInputs) => {
    try {
      await insertMessage(data.text)
      setValue('text', '')
    } catch (e) {
      setValue('text', (e as Error).message)
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-between p-2"
    >
      <TwInput
        color="primary"
        inputClassName="w-full"
        {...register('text', {
          required: true
        })}
      />
      <Button type="submit" variant="link" className="p-0 px-2">
        <IconSend />
      </Button>
    </Form>
  )
})
