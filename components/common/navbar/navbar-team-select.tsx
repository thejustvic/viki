import {Button} from '@/components/daisyui/button'
import {useTeamHandlers} from '@/components/team/team-handlers'
import {TeamStore, useTeamStore} from '@/components/team/team-store'
import {updateCurrentTeamId} from '@/components/team/update-current-team-id'
import {useCurrentTeamListener} from '@/components/team/use-current-team-listener'
import {useMemberTeamsListener} from '@/components/team/use-member-teams-listener'
import {useMyTeamsListener} from '@/components/team/use-my-teams-listener'
import {useControlledDetails} from '@/hooks/use-controlled-details'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {
  SupabaseContext,
  useSupabase
} from '@/utils/supabase-utils/supabase-provider'
import {IconSquareRoundedPlus, IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import type {MouseEvent} from 'react'
import {useEffect, useState} from 'react'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'

const useFirstCurrentTeamIdListener = ({
  user,
  supabase,
  store,
  currentTeamId
}: {
  user: SupabaseContext['user']
  supabase: SupabaseContext['supabase']
  store: TeamStore
  currentTeamId: string | null
}) => {
  useEffect(() => {
    if (currentTeamId) {
      return
    }
    const firstMyTeamId = store.state.myTeams.data?.[0].id

    if (!firstMyTeamId) {
      return
    } else {
      void (async (): Promise<void> => {
        const currentTeamId = await updateCurrentTeamId({
          currentTeamId: firstMyTeamId,
          opts: {supabase, user}
        })
        if (currentTeamId) {
          store.setCurrentTeamId(currentTeamId)
        }
      })()
    }
  }, [store.state.myTeams.data])
}

export const NavbarTeamSelect = observer(() => {
  const {user, supabase} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()
  const {removeTeam} = useTeamHandlers()
  const [state, store] = useTeamStore()
  const [id, setId] = useState('')
  const currentTeamId = state.currentTeamId

  useMemberTeamsListener({user, supabase, store, currentTeamId})
  useMyTeamsListener({user, supabase, store, currentTeamId})
  useCurrentTeamListener({user, supabase, store, currentTeamId})
  useFirstCurrentTeamIdListener({
    user,
    supabase,
    store,
    currentTeamId
  })
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
          store.setCurrentTeamId(currentTeamId)
        }
      })()
    }
    setId('')
  }, [id])
  const handleRemove = async (e: MouseEvent, id: string) => {
    e.stopPropagation()
    await removeTeam(id)
  }
  const {ref, close} = useControlledDetails()
  if (user?.is_anonymous) {
    return null
  }

  return (
    <div className="flex items-center">
      <div>team:</div>
      <TwMenu>
        <li>
          <details ref={ref}>
            <summary>{state.currentTeam.data?.name}</summary>
            <ul>
              <MyTeams
                setId={setId}
                handleRemove={handleRemove}
                showDeleteButton={Number(state.myTeams.data?.length) > 1}
                closeDetails={close}
              />
              {state.memberTeams.data?.length ? (
                <MemberTeams setId={setId} closeDetails={close} />
              ) : null}
            </ul>
          </details>
        </li>
      </TwMenu>
    </div>
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
    showDeleteButton = true,
    closeDetails
  }: {
    setId: (id: string) => void
    handleRemove: (e: MouseEvent, id: string) => Promise<void>
    showDeleteButton: boolean
    closeDetails: () => void
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
                    closeDetails()
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

const MemberTeams = observer(
  ({
    setId,
    closeDetails
  }: {
    setId: (id: string) => void
    closeDetails: () => void
  }) => {
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
                      closeDetails()
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
  }
)
