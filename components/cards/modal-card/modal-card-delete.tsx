'use client'

import {useCardHandlers} from '@/components/cards/cards-handlers'
import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useCallback, useEffect} from 'react'
import {isMobile} from 'react-device-detect'
import {useForm} from 'react-hook-form'
import {useCardsStore} from '../cards-store'
import {useSetFocusAfterTransitionEnd} from './use-set-focus-after-transitionend'

export const ModalCardDelete = observer(() => {
  const updateSearchParams = useUpdateSearchParams()
  const deleteCard = getSearchParam('delete-card')
  const [state] = useCardsStore()

  useEffect(() => {
    if (!state.idCardToDelete) {
      goBack()
    }
  }, [])

  const goBack = useCallback(() => {
    if (deleteCard) {
      updateSearchParams('delete-card')
    }
  }, [deleteCard, updateSearchParams])

  return (
    <Modal
      id="modal-delete-card"
      open={Boolean(deleteCard)}
      goBack={goBack}
      header={<ModalHeader />}
      body={<ModalBody />}
    />
  )
})

const ModalHeader = () => {
  return <div className="flex justify-center mb-2">Delete card</div>
}

const ModalBody = observer(() => {
  const [state, store] = useCardsStore()
  const {setFocus, register, handleSubmit} = useForm()

  const updateSearchParams = useUpdateSearchParams()

  const {removeCard} = useCardHandlers()

  useSetFocusAfterTransitionEnd(
    {
      id: 'dialog-modal-delete-card',
      dep: getSearchParam('delete-card')
    },
    () => {
      if (isMobile) {
        return
      }
      setFocus('hiddenField')
    },
    () => {}
  )

  const handlerClear = () => {
    store.setIdCardToDelete(null)
    updateSearchParams('delete-card')
  }

  const onFormSubmit = async () => {
    const id = state.idCardToDelete
    if (!id) {
      return
    }
    await removeCard(id)
    handlerClear()
  }

  const goBack = () => {
    handlerClear()
  }

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)} className="flex gap-2">
      <input
        {...register('hiddenField')}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: '0'
        }}
      />
      <Button soft type="submit" className="flex-1" color="error">
        delete
      </Button>
      <Button
        soft
        color="info"
        type="button"
        onClick={goBack}
        className="flex-1"
      >
        cancel
      </Button>
    </Form>
  )
})
