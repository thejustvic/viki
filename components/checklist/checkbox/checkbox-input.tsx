import {getSearchPost} from '@/app/posts/components/get-search-post'
import {IconSend} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'
import tw from 'tailwind-styled-components'
import {Button} from '../../daisyui/button'
import {Form} from '../../daisyui/form'
import {Textarea} from '../../daisyui/textarea'
import {useCheckboxHandlers} from './checkbox-handlers'

const TwInput = tw(Textarea)`
  flex-1 
  flex-shrink
  w-full
  min-h-10
  h-10
`

interface FormInputs {
  text: string
}

export const CheckboxInput = observer(() => {
  const {insertCheckbox} = useCheckboxHandlers()
  const {register, handleSubmit, setValue} = useForm<FormInputs>()
  const postId = getSearchPost()

  const onSubmit = async (data: FormInputs) => {
    if (!postId) {
      return
    }
    try {
      await insertCheckbox({title: data.text, postId})
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
