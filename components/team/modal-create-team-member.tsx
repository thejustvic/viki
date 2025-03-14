'use client'

import {useSetFocusAfterTransitionEnd} from '@/app/posts/components/modal-create-post/use-set-focus-after-transitionend'
import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'
import {Input} from '../daisyui/input'
import {useTeamMemberHandlers} from './team-member-handlers'
import {useTeamStore} from './team-store'

export const ModalCreateTeamMember = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createTeamMember = getSearchParam('create-team-member')

  const goBack = () => {
    updateSearchParams('create-team-member')
  }

  return (
    <Modal
      id="modal-create-team-member"
      open={Boolean(createTeamMember)}
      goBack={goBack}
      header={<ModalHeader />}
      body={<Data />}
    />
  )
}

const ModalHeader = () => {
  return <div className="flex justify-center mb-2">Create Team Member</div>
}

interface FormInputs {
  name: string
  email: string
}

const Data = observer(() => {
  const [state] = useTeamStore()
  const updateSearchParams = useUpdateSearchParams()

  const {insertTeamMember} = useTeamMemberHandlers()
  const {register, handleSubmit, setFocus, reset} = useForm<FormInputs>()

  useSetFocusAfterTransitionEnd(
    'dialog-modal-create-team-member',
    getSearchParam('create-team-member'),
    () => setFocus('name'),
    () => reset()
  )

  const onSubmit = async (data: FormInputs) => {
    if (!state.currentTeamId) {
      console.error('undefined currentTeamId')
      return
    }
    await insertTeamMember({
      team_id: state.currentTeamId,
      data: {
        name: data.name,
        email: data.email,
        role: 'member',
        status: 'active'
      }
    })
    updateSearchParams('create-team-member')
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 flex-col w-full"
    >
      <Input
        label="name"
        inputClassName="w-full"
        {...register('name', {
          required: true
        })}
      />
      <Input
        type="email"
        label="email"
        inputClassName="w-full"
        {...register('email', {
          required: true
        })}
      />

      <Button type="submit">Create Member</Button>
    </Form>
  )
})
