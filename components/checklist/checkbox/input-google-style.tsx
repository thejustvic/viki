import {getSearchCard} from '@/components/cards/get-search-card'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Input} from '@/components/daisyui/input'
import {IconSend} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useCheckboxHandlers} from './checkbox-handlers'

interface FormInputs {
  q_99: string
}

export const InputGoogleStyle = observer(() => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const {insertCheckbox} = useCheckboxHandlers()
  const {register, handleSubmit, setValue} = useForm<FormInputs>()
  const cardId = getSearchCard()

  useEffect(() => {
    const handleVisualUpdate = () => {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height
        // 100px threshold to ignore small changes
        setKeyboardHeight(offset > 100 ? offset : 0)
      }
    }

    window.visualViewport?.addEventListener('resize', handleVisualUpdate)
    window.visualViewport?.addEventListener('scroll', handleVisualUpdate)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleVisualUpdate)
      window.visualViewport?.removeEventListener('scroll', handleVisualUpdate)
    }
  }, [])

  const onSubmit = async (data: FormInputs) => {
    if (!cardId) {
      return
    }
    try {
      await insertCheckbox({title: data.q_99, cardId})
      setValue('q_99', '')
    } catch (e) {
      setValue('q_99', (e as Error).message)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div
        className="shadow-sm fixed z-50 py-[10px] px-[16px] bg-base-100 border-t border-base-300 left-0 right-0 bottom-0"
        style={{
          transform: `translateY(-${keyboardHeight}px)`,
          transition: 'transform 0.15s cubic-bezier(0, 0, 0.2, 1)'
        }}
      >
        <div className="relative">
          <Input
            {...register('q_99', {required: true})}
            inputClassName="pr-14 w-full focus:outline-none focus:border-primary"
            autoComplete="one-time-code" // aggressive autofill disabling for iOS
            placeholder="type..."
            type="search"
            id="q_99"
          />
          <Button
            soft
            size="sm"
            type="submit"
            className="absolute right-1 top-1 h-[32px] min-h-[32px]"
          >
            <IconSend size={18} />
          </Button>
        </div>
      </div>
    </Form>
  )
})
