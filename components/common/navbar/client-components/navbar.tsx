'use client'

import {getSearchPost} from '@/app/posts/components/get-search-post'
import {usePostsStore} from '@/app/posts/components/posts-store'
import {SwitchTheme} from '@/components/switch-theme'
import {useTeamHandlers} from '@/components/team/team-handlers'
import {useTeamStore} from '@/components/team/team-store'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconSearch,
  IconSquareRoundedPlus,
  IconTrash,
  IconUsersGroup
} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import type {MouseEvent} from 'react'
import {useEffect, useState} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import {Button} from '../../../daisyui/button'
import {Dropdown} from '../../../daisyui/dropdown'
import {Navbar as Nav} from '../../../daisyui/navbar'
import {Toggle} from '../../../daisyui/toggle'
import {useGlobalStore} from '../../../global/global-store'
import {UserImage} from '../../user-image'

export const Navbar = observer(() => {
  const {user} = useSupabase()

  return (
    <Nav
      className="sticky top-0 z-10 px-0 bg-base-200"
      style={{height: headerHeight}}
    >
      {user ? <NavStart /> : <Nav.Start />}
      <NavCenter />
      {user ? <NavEnd /> : <Nav.End />}
    </Nav>
  )
})

const NavStart = () => {
  const postId = getSearchPost()

  return (
    <Nav.Start>
      {postId && <LeftDrawerButton />}
      {!isMobile && (
        <div className="ml-4">
          <TeamSelect />
        </div>
      )}
    </Nav.Start>
  )
}

export const OpenTeamButton = observer(() => {
  const updateSearchParams = useUpdateSearchParams()
  const handleOpenTeam = () => {
    updateSearchParams('team', 'true')
  }

  return (
    <Button shape="circle" onClick={handleOpenTeam}>
      <IconUsersGroup />
    </Button>
  )
})

const LeftDrawerButton = observer(() => {
  const [state, store] = useGlobalStore()

  return (
    <Button
      className="rounded-none rounded-r-md"
      color="ghost"
      size="sm"
      onClick={store.setLeftDrawerToggle}
    >
      {state.leftDrawerOpen ? <IconArrowBarLeft /> : <IconArrowBarRight />}
    </Button>
  )
})

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

const NavCenter = () => {
  return (
    <Nav.Center className="font-mono text-lg">
      <Search />
    </Nav.Center>
  )
}

const Search = observer(() => {
  const [state, store] = usePostsStore()

  return (
    <label className="input input-info border-none">
      <IconSearch />
      <input
        type="search"
        placeholder="Search"
        onChange={e => store.setSearchValue(e.target.value)}
        value={state.searchValue}
      />
    </label>
  )
})

const NavEnd = observer(() => {
  const [state, store] = useGlobalStore()

  const toggleRightDrawer = () => {
    store.setRightDrawerToggle()
  }

  return (
    <Nav.End className="gap-2">
      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <SwitchTheme />
          <AvatarDropdown />
        </div>
        <Button
          className="rounded-none rounded-l-md"
          color="ghost"
          size="sm"
          onClick={toggleRightDrawer}
        >
          <div className="text-lg normal-case">
            {state.rightDrawerOpen ? (
              <IconArrowBarRight />
            ) : (
              <IconArrowBarLeft />
            )}
          </div>
        </Button>
      </div>
    </Nav.End>
  )
})

const AvatarDropdown = observer(() => {
  const [state, store] = useGlobalStore()
  const {supabase, user} = useSupabase()
  const postId = getSearchPost()

  const handleLogout = async () => {
    store.setLogging('logout')
    await supabase.auth.signOut()
    store.setLoggingOff()
  }

  if (!user) {
    return null
  }

  return (
    <Dropdown placements={['end']} hover>
      <Button color="ghost" shape="square">
        <UserImage src={user.user_metadata?.avatar_url} />
      </Button>
      <Dropdown.Menu className="shadow-lg bg-base-200">
        {postId && <LabelShowLeftMenu />}
        {isMobile && (
          <div className="flex gap-1">
            <TeamSelect />
          </div>
        )}
        <Button onClick={handleLogout} loading={state.logging.logout}>
          Logout
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  )
})

const LabelShowLeftMenu = observer(() => {
  const [state, store] = useGlobalStore()
  return (
    <Dropdown.Item className="flex">
      <label className="fieldset-label">
        <span className="truncate">show left menu on hover</span>
        <Toggle
          checked={state.showLeftMenuOnHover}
          onChange={store.setShowLeftMenuOnHoverToggle}
        />
      </label>
    </Dropdown.Item>
  )
})
