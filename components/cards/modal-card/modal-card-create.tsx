'use client'

import {useCardHandlers} from '@/components/cards/cards-handlers'
import {useSetFocusAfterTransitionEnd} from '@/components/cards/modal-card/use-set-focus-after-transitionend'
import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Textarea} from '@/components/daisyui/textarea'
import {useBoolean} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'
import {useForm, UseFormResetField, UseFormSetFocus} from 'react-hook-form'
import tw from 'tailwind-styled-components'

const TwError = tw.p`
  w-full 
  text-xs 
  text-center 
  text-error
`

const TwErrorWrapper = tw.div`
  p-2
  bg-info-content
  rounded-xl
`

export const ModalCardCreate = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createCard = getSearchParam('create-card')

  const goBack = useCallback(() => {
    if (createCard) {
      updateSearchParams('create-card')
    }
  }, [createCard, updateSearchParams])

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
  createCard69: string
}

const useTransitionEnd = (
  setFocus: UseFormSetFocus<FormInputs>,
  resetField: UseFormResetField<FormInputs>
) => {
  useSetFocusAfterTransitionEnd(
    {
      id: 'dialog-modal-create-card',
      dep: getSearchParam('create-card')
    },
    () => setFocus('createCard69'),
    () => resetField('createCard69')
  )
}

const Text = observer(() => {
  const updateSearchParams = useUpdateSearchParams()
  const {insertCard} = useCardHandlers()
  const {
    register,
    handleSubmit,
    setFocus,
    resetField,
    setError,
    formState: {errors}
  } = useForm<FormInputs>()
  useTransitionEnd(setFocus, resetField)
  const load = useBoolean(false)

  const onSubmit = async (data: FormInputs) => {
    if (!data.createCard69.trim()) {
      return
    }
    load.turnOn()
    const {data: insertCardData, error} = await insertCard(data.createCard69)
    if (insertCardData) {
      load.turnOff()
      updateSearchParams('create-card')
    }
    if (error) {
      load.turnOff()
      setError(
        'createCard69',
        {type: 'focus', message: error.message},
        {shouldFocus: true}
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit(onSubmit)()
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col">
      <Textarea
        textareaId="modal-card-create"
        size="md"
        className="w-full"
        {...register('createCard69', {
          required: true
        })}
        onKeyDown={handleKeyDown}
      />
      {errors.createCard69?.message &&
        errors.createCard69?.message?.length > 0 && (
          <TwErrorWrapper>
            <TwError>{errors.createCard69.message}</TwError>
          </TwErrorWrapper>
        )}
      <Button
        soft
        color="primary"
        type="submit"
        disable={load.value}
        loading={load.value}
      >
        Submit
      </Button>
    </Form>
  )
})
