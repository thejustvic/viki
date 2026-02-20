/* eslint-disable max-lines-per-function */
import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Input} from '@/components/daisyui/input'
import {IconSend} from '@tabler/icons-react'
import {generateKeyBetween} from 'fractional-indexing'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'
import tw from 'tailwind-styled-components'
import {useCheckboxHandlers} from './checkbox-handlers'

interface FormInputs {
  q_99: string
}

const TwContainer = tw.div`
  fixed 
  z-50 
  py-[10px] 
  px-[16px] 
  transition-transform 
  duration-[100ms] 
  ease-out 
  left-0 
  bottom-0 
  right-0
  shadow-sm
  bg-base-200
`

/* 
  hide keyboard height calculations until i figure out 
  how to prevent mobile view from shifting up when 
  the keyboard appears
*/

export const InputGoogleStyle = observer(() => {
  // const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [, store] = useCardChecklistStore()
  const {insertCheckbox} = useCheckboxHandlers()
  const {register, handleSubmit, setValue} = useForm<FormInputs>()
  const cardId = getSearchCard()
  // useEffect(() => {
  //   const handleVisualUpdate = () => {
  //     if (window.visualViewport) {
  //       const viewportHeight = window.visualViewport.height
  //       const windowHeight = window.innerHeight

  //       const offset = windowHeight - viewportHeight
  //       const actualKeyboardHeight = offset > 100 ? offset : 0

  //       setKeyboardHeight(actualKeyboardHeight)
  //     }
  //   }
  //   window.visualViewport?.addEventListener('resize', handleVisualUpdate)
  //   window.visualViewport?.addEventListener('scroll', handleVisualUpdate)
  //   return () => {
  //     window.visualViewport?.removeEventListener('resize', handleVisualUpdate)
  //     window.visualViewport?.removeEventListener('scroll', handleVisualUpdate)
  //   }
  // }, [])
  const onSubmit = async (data: FormInputs) => {
    if (!cardId) {
      return
    }
    try {
      const checklists = store.getCheckboxesCompleted(cardId)
      const lastPosition = checklists?.[checklists.length - 1]?.position || null
      const newPosition = generateKeyBetween(lastPosition, null)
      await insertCheckbox({title: data.q_99, cardId, newPosition})
      setValue('q_99', '')
    } catch (e) {
      setValue('q_99', (e as Error).message)
    }
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {/* 
          hide transform:translateY until i figure out 
          how to prevent mobile view from shifting up when 
          the keyboard appears
      */}
      <TwContainer
        style={
          {
            // transform: `translateY(-${keyboardHeight}px)`,
          }
        }
      >
        <div className="relative shadow-sm">
          <Input
            {...register('q_99', {required: true})}
            inputClassName="pr-16 w-full focus:outline-none focus:border-primary"
            autoComplete="off"
            placeholder="type some stuff..."
            type="search"
            id="q_99"
          />
          <Button
            soft
            size="sm"
            type="submit"
            className="absolute right-1 top-1"
          >
            <IconSend />
          </Button>
        </div>
      </TwContainer>
    </Form>
  )
})
