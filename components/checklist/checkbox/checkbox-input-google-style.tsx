import {getSearchCard} from '@/components/cards/get-search-card'
import {Form} from '@/components/daisyui/form'
import {IconSend} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {CSSProperties, useEffect, useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useCheckboxHandlers} from './checkbox-handlers'

interface FormInputs {
  text: string
}

const buttonStyles: CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer'
}

const inputStyles: CSSProperties = {
  width: '100%',
  fontSize: '16px',
  outline: 'none'
}

export const GoogleStyleInput = observer(() => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const {insertCheckbox} = useCheckboxHandlers()
  const {register, handleSubmit, setValue} = useForm<FormInputs>()
  const cardId = getSearchCard()

  useEffect(() => {
    const handleVisualUpdate = () => {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height
        setKeyboardHeight(offset > 0 ? offset : 0)
        if (containerRef.current) {
          containerRef.current.style.bottom = `${offset}px`
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
      await insertCheckbox({title: data.text, cardId})
      setValue('text', '')
    } catch (e) {
      setValue('text', (e as Error).message)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div
        className="shadow-sm"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(-${keyboardHeight}px)`,
          zIndex: 1000,
          padding: '10px 16px',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div style={{position: 'relative'}}>
          <input
            {...register('text', {required: true})}
            className="input input-md flex-1 flex-shrink w-full min-h-10 h-10 focus:outline-none focus:border-primary"
            autoComplete="off"
            type="text"
            placeholder="type..."
            style={inputStyles}
          />
          <button type="submit" style={buttonStyles}>
            <IconSend />
          </button>
        </div>
      </div>
    </Form>
  )
})
