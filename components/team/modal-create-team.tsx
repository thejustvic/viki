'use client'

import {useSetFocusAfterTransitionEnd} from '@/components/cards/modal-card/use-set-focus-after-transitionend'
import {Modal} from '@/components/common/modal'
import {Button} from '@/components/daisyui/button'
import {Form} from '@/components/daisyui/form'
import {Input} from '@/components/daisyui/input'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useForm} from 'react-hook-form'
import {useTeamHandlers} from './team-handlers'

export const ModalCreateTeam = () => {
  const updateSearchParams = useUpdateSearchParams()
  const createTeam = getSearchParam('create-team')

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

  useSetFocusAfterTransitionEnd(
    {
      id: 'dialog-modal-create-team',
      dep: getSearchParam('create-team')
    },
    () => setFocus('name'),
    () => reset()
  )

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
      <Button soft color="primary" type="submit">
        Create Team
      </Button>
    </Form>
  )
})
