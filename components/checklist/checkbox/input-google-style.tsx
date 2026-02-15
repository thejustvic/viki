/* eslint-disable max-lines-per-function */
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
        className="shadow-sm fixed z-50 py-[10px] px-[16px] pointer-events-none"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(-${keyboardHeight}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="relative pointer-events-none">
          <div
            style={{
              opacity: 0,
              position: 'absolute',
              height: 0,
              overflow: 'hidden'
            }}
          >
            <input type="text" tabIndex={-1} />
            <input type="password" tabIndex={-1} />
          </div>
          <Input
            {...register('q_99', {required: true})}
            inputClassName="pr-14 w-full focus:outline-none focus:border-primary pointer-events-auto"
            autoComplete="one-time-code" // aggressive autofill disabling for iOS
            placeholder="type..."
            type="search"
            id="q_99"
            readOnly
            onBlur={e => e.target.setAttribute('readonly', 'true')}
            onFocus={e => e.target.removeAttribute('readOnly')}
            onClick={e => e.stopPropagation()}
          />
          <Button
            soft
            size="sm"
            type="submit"
            className="absolute right-1 top-1 h-[32px] min-h-[32px] pointer-events-auto"
          >
            <IconSend size={18} />
          </Button>
        </div>
      </div>
    </Form>
  )
})
