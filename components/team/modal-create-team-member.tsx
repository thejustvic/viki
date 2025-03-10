'use client'

import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {Util} from '@/utils/util'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Input} from '../daisyui/input'
import {useTeamHandlers} from './team-handlers'
import {useTeamStore} from './team-store'

export const ModalCreateTeamMember = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createTeamMember = Util.getSearchParam('create-team-member')

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

  const {insertTeamMember} = useTeamHandlers()
  const {register, handleSubmit, setFocus, reset} = useForm<FormInputs>()

  const createTeamMemberSearch = Util.getSearchParam('create-team-member')

  useEffect(() => {
    if (createTeamMemberSearch) {
      document
        .getElementById('dialog-modal-create-team-member')
        ?.addEventListener('transitionend', e => {
          if (e.propertyName === 'opacity') {
            setFocus('name')
          }
        })
    } else {
      reset()
    }
  }, [createTeamMemberSearch])

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
