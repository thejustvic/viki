'use client'

import {useCardHandlers} from '@/components/cards/cards-handlers'
import {useSetFocusAfterTransitionEnd} from '@/components/cards/modal-card/use-set-focus-after-transitionend'
import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Textarea} from '@/components/daisyui/textarea'
import {useTeamStore} from '@/components/team/team-store'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'

export const ModalCardCreate = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createCard = getSearchParam('create-card')

  const goBack = () => {
    updateSearchParams('create-card')
  }

  return (
    <Modal
      id="modal-create-card"
      open={Boolean(createCard)}
      goBack={goBack}
      header={<ModalHeader />}
      body={<ModalBody />}
    />
  )
}

const ModalHeader = () => {
  return <div className="flex justify-center mb-2">Create card</div>
}

const ModalBody = () => (
  <div className="flex flex-col gap-1">
    <Text />
  </div>
)

interface FormInputs {
  text: string
}

const Text = observer(() => {
  const [state] = useTeamStore()

  const updateSearchParams = useUpdateSearchParams()

  const {insertCard} = useCardHandlers()
  const {register, handleSubmit, setFocus, resetField} = useForm<FormInputs>()

  useSetFocusAfterTransitionEnd(
    {
      id: 'dialog-modal-create-card',
      dep: getSearchParam('create-card')
    },
    () => setFocus('text'),
    () => resetField('text')
  )

  const onSubmit = async (data: FormInputs) => {
    if (!state.currentTeamId || !data.text.trim()) {
      return
    }
    await insertCard(data.text, state.currentTeamId)
    updateSearchParams('create-card')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col">
      <Textarea
        size="md"
        className="w-full"
        {...register('text', {
          required: true
        })}
        onKeyDown={handleKeyDown}
      />
      <Button soft color="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
})
