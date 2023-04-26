'use client'

import {Modal} from '@/components/common/modal'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button, Form, Textarea} from 'react-daisyui'
import {useForm} from 'react-hook-form'
import {usePostHandlers} from '../posts-handlers'

export const ModalCreatePost = () => {
  const searchParams = useSearchParams()
  const value = searchParams.get('create-post')
  const router = useRouter()

  const goBack = () => router.push('/')

  return (
    <Modal
      open={Boolean(value)}
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
  const router = useRouter()
  const {insertPost} = usePostHandlers()
  const {register, handleSubmit} = useForm<FormInputs>()

  const onSubmit = async (data: FormInputs) => {
    await insertPost(data.text)
    router.push('/')
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <Textarea
        size="md"
        autoFocus
        {...register('text', {
          required: true
        })}
      />
      <Button type="submit">Submit</Button>
    </Form>
  )
}
