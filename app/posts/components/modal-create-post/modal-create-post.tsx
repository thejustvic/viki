'use client'

import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Textarea} from '@/components/daisyui/textarea'
import {useTeamStore} from '@/components/team/team-store'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'
import {usePostHandlers} from '../posts-handlers'
import {useSetFocusAfterTransitionEnd} from './use-set-focus-after-transitionend'

export const ModalCreatePost = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createPost = getSearchParam('create-post')

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

  const {insertPost} = usePostHandlers()
  const {register, handleSubmit, setFocus, resetField} = useForm<FormInputs>()

  useSetFocusAfterTransitionEnd(
    'dialog-modal-create-post',
    getSearchParam('create-post'),
    () => setFocus('text'),
    () => resetField('text')
  )

  const onSubmit = async (data: FormInputs) => {
    if (!state.currentTeamId) {
      return
    }
    await insertPost(data.text, state.currentTeamId)
    updateSearchParams('create-post')
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col">
      <Textarea
        size="md"
        className="w-full border-none"
        {...register('text', {
          required: true
        })}
      />
      <Button type="submit">Submit</Button>
    </Form>
  )
})
