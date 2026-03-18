import {Loader} from '@/components/common/loader'
import tw from '@/components/common/tw-styled-components'
import {observer} from 'mobx-react-lite'

import {Button} from '@/components/daisyui/button'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconSquareRoundedPlus} from '@tabler/icons-react'
import type {MouseEvent} from 'react'
import {SimpleScrollbar} from '../common/simple-scrollbar'
import {useTeamMemberHandlers} from './team-member-handlers'
import {useTeamStore} from './team-store'

export const Team = observer(() => {
  return (
    <>
      <div className="h-[125px]">
        <TeamMembers />
      </div>
      <div className="flex pt-2">
        <AddTeamMember />
      </div>
    </>
  )
})

const AddTeamMember = () => {
  const updateSearchParams = useUpdateSearchParams()
  const handlerAddMember = () => {
    updateSearchParams('create-team-member', 'true')
  }

  return (
    <Button
      soft
      color="info"
      onClick={handlerAddMember}
      className="text-sm h-[32px] p-2"
    >
      <IconSquareRoundedPlus size={24} /> add member
    </Button>
  )
}

const TwState = tw.div`
  flex
  h-full
  w-full
  justify-center
  items-center
`

const TwWrapper = tw.div`
  flex
  flex-col
  gap-2
  h-full
`

const TwRow = tw.div`
  flex
  justify-between
  gap-2
  px-2
  pr-0
  my-px
  rounded-full
  hover:bg-accent/20
`

const TwTeamMember = tw.div`
  flex
  gap-2
  w-5/6
`

const TwTeamMemberName = tw.span`
  opacity-70
  truncate
  max-w-2/4
  flex-1
`

const TwTeamMemberEmail = tw.span`
  opacity-50
  truncate
  max-w-2/4
  flex-1
`

const TeamMembers = observer(() => {
  const [state] = useTeamStore()
  const {removeTeamMember} = useTeamMemberHandlers()

  const handleRemove = async (e: MouseEvent, id: string) => {
    e.stopPropagation()
    await removeTeamMember(id)
  }

  if (state.currentTeam.loading) {
    return (
      <TwState>
        <Loader />
      </TwState>
    )
  }

  if (state.currentTeam.error) {
    return <TwState>{state.currentTeam.error.message}</TwState>
  }

  if (state.currentTeam.data?.team_members.length === 0) {
    return <TwState className="text-info">add some team members</TwState>
  }

  return (
    <TwWrapper>
      <SimpleScrollbar>
        {state.currentTeam.data?.team_members.map(teamMember => {
          return (
            <TwRow key={teamMember.id}>
              <TwTeamMember>
                <TwTeamMemberName title={teamMember.name}>
                  {teamMember.name}
                </TwTeamMemberName>
                <TwTeamMemberEmail title={teamMember.email}>
                  {teamMember.email}
                </TwTeamMemberEmail>
              </TwTeamMember>
              <Button
                soft
                color="error"
                size="xs"
                className="text-xs"
                onClick={e => handleRemove(e, teamMember.id)}
              >
                delete
              </Button>
            </TwRow>
          )
        })}
      </SimpleScrollbar>
    </TwWrapper>
  )
})
