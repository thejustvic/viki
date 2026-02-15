import {getSearchCard} from '@/components/cards/get-search-card'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Input} from '@/components/daisyui/input'
import {IconSend} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'
import tw from 'tailwind-styled-components'
import {useChatHandlers} from './chat-handlers'

const TwInput = tw(Input)`
  flex-1 
  flex-shrink
  mb-2
`

interface FormInputs {
  chatInput69: string
}

export const ChatInput = observer(() => {
  const {insertMessage} = useChatHandlers()
  const {register, handleSubmit, setValue} = useForm<FormInputs>()
  const cardId = getSearchCard()

  const onSubmit = async (data: FormInputs) => {
    if (!cardId) {
      return
    }
    try {
      await insertMessage({text: data.chatInput69, cardId})
      setValue('chatInput69', '')
    } catch (e) {
      setValue('chatInput69', (e as Error).message)
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-between p-2"
    >
      <TwInput
        inputClassName="w-full focus:outline-none focus:border-primary"
        {...register('chatInput69', {
          required: true
        })}
        id="r_69"
        placeholder="type some message..."
        type="search"
      />
      <Button ghost variant="link" type="submit" className="p-0 px-2">
        <IconSend />
      </Button>
    </Form>
  )
})
