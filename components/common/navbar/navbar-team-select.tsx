import {Button} from '@/components/daisyui/button'
import {useTeamHandlers} from '@/components/team/team-handlers'
import {useTeamStore} from '@/components/team/team-store'
import {updateCurrentTeamId} from '@/components/team/update-current-team-id'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconSquareRoundedPlus, IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import type {MouseEvent} from 'react'
import {useEffect, useState} from 'react'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'

const useFirstCurrentTeamIdListener = () => {
  const {user, supabase} = useSupabase()
  const [teamState, teamStore] = useTeamStore()

  useEffect(() => {
    if (teamState.currentTeamId) {
      return
    }
    const firstMyTeamId = teamState.myTeams.data?.[0].id
    if (!firstMyTeamId) {
      return
    }

    void (async (): Promise<void> => {
      const currentTeamId = await updateCurrentTeamId({
        currentTeamId: firstMyTeamId,
        opts: {supabase, user}
      })
      if (currentTeamId) {
        teamStore.setCurrentTeamId(currentTeamId)
      }
    })()
  }, [teamState.myTeams.data])
}

export const NavbarTeamSelect = observer(() => {
  const {user, supabase} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()
  const {removeTeam} = useTeamHandlers()
  const [teamState, teamStore] = useTeamStore()
  const [id, setId] = useState('')

  useFirstCurrentTeamIdListener()

  useEffect(() => {
    if (!id) {
      return
    }
    if (id === 'create-team') {
      updateSearchParams('create-team', 'true')
    } else {
      void (async (): Promise<void> => {
        const currentTeamId = await updateCurrentTeamId({
          currentTeamId: id,
          opts: {supabase, user}
        })
        if (currentTeamId) {
          teamStore.setCurrentTeamId(currentTeamId)
        }
      })()
    }
    setId('')
  }, [id])

  const handleRemove = async (e: MouseEvent, id: string) => {
    e.stopPropagation()
    await removeTeam(id)
  }

  return (
    <TwMenu>
      <li>
        <details>
          <summary>{teamState.currentTeam.data?.name}</summary>
          <ul>
            <MyTeams
              setId={setId}
              handleRemove={handleRemove}
              showDeleteButton={Number(teamState.myTeams.data?.length) > 1}
            />
            {teamState.memberTeams.data?.length ? (
              <MemberTeams setId={setId} />
            ) : null}
          </ul>
        </details>
      </li>
    </TwMenu>
  )
})

const TwMenu = tw.ul`
  menu 
  menu-horizontal 
  bg-base-200 
  rounded-box 
  gap-2 
  items-center
`

const MyTeams = observer(
  ({
    setId,
    handleRemove,
    showDeleteButton = true
  }: {
    setId: (id: string) => void
    handleRemove: (e: MouseEvent, id: string) => Promise<void>
    showDeleteButton: boolean
  }) => {
    const [teamState] = useTeamStore()

    return (
      <li>
        <details open>
          <summary className="truncate">my teams</summary>
          <ul>
            {teamState.myTeams.data?.map(team => {
              const currentTeamIdEqual =
                teamState.currentTeam.data?.id === team.id
              return (
                <li
                  key={team.id}
                  className={twJoin(currentTeamIdEqual && 'bg-accent-content')}
                  onClick={() => {
                    setId(team.id)
                  }}
                >
                  <div className="flex justify-between">
                    <div>{team.name}</div>
                    {showDeleteButton && !currentTeamIdEqual && (
                      <Button
                        size="xs"
                        color="ghost"
                        shape="circle"
                        onClick={e => handleRemove(e, team.id)}
                      >
                        <IconTrash size={14} />
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
            <li>
              <a onClick={() => setId('create-team')} className="truncate">
                <IconSquareRoundedPlus size={18} /> new team
              </a>
            </li>
          </ul>
        </details>
      </li>
    )
  }
)

const MemberTeams = observer(({setId}: {setId: (id: string) => void}) => {
  const [teamState] = useTeamStore()
  return (
    <li>
      <details open>
        <summary className="truncate">member teams</summary>
        <ul>
          {teamState.memberTeams.data?.map(team => {
            return (
              <li
                key={team.id}
                className={twJoin(
                  teamState.currentTeam.data?.id === team.id &&
                    'bg-accent-content rounded-sm'
                )}
              >
                <a
                  onClick={() => {
                    setId(team.id)
                  }}
                >
                  {team.name}
                </a>
              </li>
            )
          })}
        </ul>
      </details>
    </li>
  )
})
