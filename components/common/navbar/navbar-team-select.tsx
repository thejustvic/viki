import tw from '@/components/common/tw-styled-components'
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
import {useEffect} from 'react'
import {twJoin} from 'tailwind-merge'

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
    const firstTeam = store.state.myTeams.data?.[0]
    const firstMyTeamId = firstTeam?.id

    if (firstTeam?.owner_id !== user?.id) {
      return
    }
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

export const useTeamSync = () => {
  const {user, supabase} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()

  const [state, store] = useTeamStore()

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
    if (!state.id) {
      return
    }
    if (state.id === 'create-team') {
      updateSearchParams('create-team', 'true')
    } else {
      const syncTeam = async () => {
        const currentTeamId = await updateCurrentTeamId({
          currentTeamId: state.id,
          opts: {supabase, user}
        })
        if (currentTeamId) {
          store.setCurrentTeamId(currentTeamId)
        }
      }
      void syncTeam()
    }
    store.setId('')
  }, [state.id])

  return {currentTeamId}
}

export const NavbarTeamSelect = observer(() => {
  const {user} = useSupabase()

  const {removeTeam} = useTeamHandlers()
  const [state] = useTeamStore()

  const handleRemove = async (e: MouseEvent, id: string) => {
    e.stopPropagation()
    await removeTeam(id)
  }

  const {ref, close} = useControlledDetails()

  if (user?.is_anonymous) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <TwMenu>
        <li className="w-full min-w-[110px]">
          <details ref={ref}>
            <summary>
              <p className="truncate ">{state.currentTeam.data?.name}</p>
            </summary>
            <ul>
              <MyTeams
                handleRemove={handleRemove}
                showDeleteButton={Number(state.myTeams.data?.length) > 1}
                closeDetails={close}
              />
              {state.memberTeams.data?.length ? (
                <MemberTeams closeDetails={close} />
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
  items-center
  p-0
`

const MyTeams = observer(
  ({
    handleRemove,
    showDeleteButton = true,
    closeDetails
  }: {
    handleRemove: (e: MouseEvent, id: string) => Promise<void>
    showDeleteButton: boolean
    closeDetails: () => void
  }) => {
    const [teamState, teamStore] = useTeamStore()

    return (
      <li>
        <details open>
          <summary>my teams</summary>
          <ul>
            {teamState.myTeams.data?.map(team => {
              const currentTeamIdEqual =
                teamState.currentTeam.data?.id === team.id
              return (
                <li
                  key={team.id}
                  className={twJoin(currentTeamIdEqual && 'bg-accent-content')}
                  onClick={() => {
                    teamStore.setId(team.id)
                    closeDetails()
                  }}
                >
                  <div className="flex justify-between">
                    <div>{team.name}</div>
                    {showDeleteButton && !currentTeamIdEqual && (
                      <Button
                        soft
                        color="error"
                        size="xs"
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
              <a
                onClick={() => teamStore.setId('create-team')}
                className="truncate"
              >
                <IconSquareRoundedPlus size={18} /> new team
              </a>
            </li>
          </ul>
        </details>
      </li>
    )
  }
)

const MemberTeams = observer(({closeDetails}: {closeDetails: () => void}) => {
  const [teamState, teamStore] = useTeamStore()
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
                    teamStore.setId(team.id)
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
})
