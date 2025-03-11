import {Button} from '@/components/daisyui/button'
import {useTeamHandlers} from '@/components/team/team-handlers'
import {useTeamStore} from '@/components/team/team-store'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconSquareRoundedPlus, IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import type {MouseEvent} from 'react'
import {useEffect, useState} from 'react'
import {twJoin} from 'tailwind-merge'
import {OpenTeamButton} from './open-team-button'

export const TeamSelect = observer(() => {
  const updateSearchParams = useUpdateSearchParams()
  const {removeTeam} = useTeamHandlers()
  const [teamState, teamStore] = useTeamStore()
  const [id, setId] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }
    if (id === 'add') {
      updateSearchParams('create-team', 'true')
    } else {
      teamStore.setCurrentTeamId(id)
    }
    setId('')
  }, [id])

  const handleRemove = async (e: MouseEvent, id: string) => {
    e.stopPropagation()
    await removeTeam(id)
  }

  return (
    <ul className="menu menu-horizontal bg-base-200 rounded-box gap-2 items-center">
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
      <li>
        <OpenTeamButton />
      </li>
    </ul>
  )
})

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
          <summary>my teams</summary>
          <ul>
            {teamState.myTeams.data?.map(team => {
              return (
                <li
                  key={team.id}
                  className={twJoin(
                    teamState.currentTeam.data?.id === team.id &&
                      'bg-accent-content'
                  )}
                  onClick={() => setId(team.id)}
                >
                  <div className="flex justify-between">
                    <div>{team.name}</div>
                    {showDeleteButton && (
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
              <a onClick={() => setId('add')}>
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
        <summary>member teams</summary>
        <ul>
          {teamState.memberTeams.data?.map(team => {
            return (
              <li
                key={team.id}
                className={twJoin(
                  teamState.currentTeam.data?.id === team.id &&
                    'bg-accent-content'
                )}
              >
                <a onClick={() => setId(team.id)}>{team.name}</a>
              </li>
            )
          })}
        </ul>
      </details>
    </li>
  )
})
