'use client'

import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Textarea} from '@/components/daisyui/textarea'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {Util} from '@/utils/util'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {usePostHandlers} from '../posts-handlers'

export const ModalCreatePost = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createPost = Util.getSearchParam('create-post')

  const goBack = () => {
    updateSearchParams('create-post')
  }

  return (
    <Modal
      id="modal-create-post"
      open={Boolean(createPost)}
      goBack={goBack}
      header={<ModalHeader />}
      body={<ModalBody />}
    />
  )
}

const ModalHeader = () => {
  return <div>Create card</div>
}

const ModalBody = () => (
  <div className="flex flex-col gap-1">
    <Text />
  </div>
)

interface FormInputs {
  text: string
}

const Text = () => {
  const updateSearchParams = useUpdateSearchParams()

  const {insertPost} = usePostHandlers()
  const {register, handleSubmit, setFocus, resetField} = useForm<FormInputs>()

  const createPostSearch = Util.getSearchParam('create-post')

  useEffect(() => {
    if (createPostSearch) {
      document
        .getElementById('dialog-modal-create-post')
        ?.addEventListener('transitionend', e => {
          if (e.propertyName === 'opacity') {
            setFocus('text')
          }
        })
    } else {
      resetField('text')
    }
  }, [createPostSearch])

  const onSubmit = async (data: FormInputs) => {
    await insertPost(data.text)
    updateSearchParams('create-post')
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col">
      <Textarea
        size="md"
        className="w-full"
        {...register('text', {
          required: true
        })}
      />
      <Button type="submit">Submit</Button>
    </Form>
  )
}
