/* eslint-disable max-lines-per-function */
import {getSearchCard} from '@/components/cards/get-search-card'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {IconSend} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useEffect, useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useCheckboxHandlers} from './checkbox-handlers'

interface FormInputs {
  q_99: string
}

export const InputGoogleStyle = observer(() => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const {insertCheckbox} = useCheckboxHandlers()
  const {register, handleSubmit, setValue} = useForm<FormInputs>()
  const cardId = getSearchCard()
  useEffect(() => {
    const handleVisualUpdate = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height
        const windowHeight = window.innerHeight

        const offset = windowHeight - viewportHeight
        const actualKeyboardHeight = offset > 100 ? offset : 0

        setKeyboardHeight(actualKeyboardHeight)

        if (containerRef.current) {
          containerRef.current.style.transform = `translateY(-${actualKeyboardHeight}px)`
        }
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
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
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
          <input
            {...register('q_99', {required: true})}
            className="input input-md pr-20 flex-1 flex-shrink w-full min-h-10 h-10 focus:outline-none focus:border-primary pointer-events-auto"
            autoComplete="off"
            placeholder="type..."
            readOnly
            type="search"
            onBlur={e => e.target.setAttribute('readonly', 'true')}
            onFocus={e => e.target.removeAttribute('readOnly')}
            onClick={e => e.stopPropagation()}
            id="q_99"
          />
          <Button
            soft
            size="sm"
            type="submit"
            onClick={e => e.stopPropagation()}
            className="absolute right-1 top-1 pointer-events-auto"
          >
            <IconSend />
          </Button>
        </div>
      </div>
    </Form>
  )
})
