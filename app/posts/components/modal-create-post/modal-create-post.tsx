'use client'

import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Textarea} from '@/components/daisyui/textarea'
import {Util} from '@/utils/util'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {usePostHandlers} from '../posts-handlers'

export const ModalCreatePost = () => {
  const searchParams = useSearchParams()
  const value = searchParams.get('create-post')
  const router = useRouter()
  const pathname = usePathname()

  const goBack = () => {
    const queryString = Util.deleteQueryParam(searchParams, 'create-post')
    Util.routerPushQuery(router, queryString, pathname)
  }

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
  const searchParams = useSearchParams()
  const value = searchParams.get('create-post')
  const router = useRouter()
  const {insertPost} = usePostHandlers()
  const {register, handleSubmit, setFocus} = useForm<FormInputs>()

  useEffect(() => {
    if (value) {
      setTimeout(() => setFocus('text'), 20)
    }
  }, [setFocus, value])

  const onSubmit = async (data: FormInputs) => {
    await insertPost(data.text)
    router.push('/')
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
