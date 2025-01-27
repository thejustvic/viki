import {IconSend} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {Button, Form, Input} from 'react-daisyui'
import {useForm} from 'react-hook-form'
import tw from 'tailwind-styled-components'
import {useChatHandlers} from './chat-handlers'

const TwInput = tw(Input)`
  flex-1 
  flex-shrink
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
    <Form onSubmit={handleSubmit(onSubmit)} style={{flexDirection: 'row'}}>
      <TwInput
        color="primary"
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
