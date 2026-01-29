import {Loader} from '@/components/common/loader'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'

import {Button} from '@/components/daisyui/button'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconSquareRoundedPlus} from '@tabler/icons-react'
import type {MouseEvent} from 'react'
import {useTeamMemberHandlers} from './team-member-handlers'
import {useTeamStore} from './team-store'

export const Team = observer(() => {
  const [scrollEl, setScrollEl] = useState<HTMLElement>()
  const [state] = useTeamStore()

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }, [state.currentTeam.data, scrollEl])

  return (
    <PerfectScrollbar containerRef={setScrollEl}>
      <TeamMembers />
      <div className="flex pt-2">
        <AddTeamMember />
      </div>
    </PerfectScrollbar>
  )
})

const AddTeamMember = () => {
  const updateSearchParams = useUpdateSearchParams()
  const handlerAddMember = () => {
    updateSearchParams('create-team-member', 'true')
  }

  return (
    <Button onClick={handlerAddMember} className="text-sm h-[32px] p-2">
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
    <div className="flex flex-col gap-2">
      {state.currentTeam.data?.team_members.map(teamMember => {
        return (
          <div className="flex justify-between gap-2" key={teamMember.id}>
            <div className="flex gap-2 truncate">
              <span className="truncate">{teamMember.name}</span>
              <span className="opacity-50 truncate">{teamMember.email}</span>
            </div>
            <Button
              size="xs"
              className="text-xs"
              onClick={e => handleRemove(e, teamMember.id)}
            >
              delete
            </Button>
          </div>
        )
      })}
    </div>
  )
})
