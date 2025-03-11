'use client'

import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Input} from '../daisyui/input'
import {useTeamHandlers} from './team-handlers'

export const ModalCreateTeam = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createTeam = Util.getSearchParam('create-team')

  const goBack = () => {
    updateSearchParams('create-team')
  }

  return (
    <Modal
      id="modal-create-team"
      open={Boolean(createTeam)}
      goBack={goBack}
      header={<ModalHeader />}
      body={<Data />}
    />
  )
}

const ModalHeader = () => {
  return <div className="flex justify-center mb-2">Create Team</div>
}

interface FormInputs {
  name: string
}

const Data = observer(() => {
  const {user} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()

  const {insertTeam} = useTeamHandlers()
  const {register, handleSubmit, setFocus, reset} = useForm<FormInputs>()

  const createTeamSearch = Util.getSearchParam('create-team')

  useEffect(() => {
    if (createTeamSearch) {
      document
        .getElementById('dialog-modal-create-team')
        ?.addEventListener('transitionend', e => {
          if (e.propertyName === 'opacity') {
            setFocus('name')
          }
        })
    } else {
      reset()
    }
  }, [createTeamSearch])

  const onSubmit = async (data: FormInputs) => {
    if (!user) {
      console.error('undefined user')
      return
    }
    await insertTeam({
      owner_id: user.id,
      data: {
        name: data.name
      }
    })
    updateSearchParams('create-team')
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
      <Button type="submit">Create Team</Button>
    </Form>
  )
})
