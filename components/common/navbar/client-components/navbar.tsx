'use client'

import {getSearchPost} from '@/app/posts/components/get-search-post'
import {usePostsStore} from '@/app/posts/components/posts-store'
import {SwitchTheme} from '@/components/switch-theme'
import {useTeamStore} from '@/components/team/team-store'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconSearch,
  IconUsersGroup
} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import {isMobile} from 'react-device-detect'
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
        <div className="ml-4 flex gap-2">
          <TeamSelect />
          <OpenTeamButton />
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
  const [teamState, teamStore] = useTeamStore()
  const [id, setId] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }
    teamStore.setCurrentTeamId(id)
    setId('')
  }, [id])

  return (
    <select
      value={teamState.currentTeamId || ''}
      className="select select-neutral w-32"
      onChange={({target: {value}}) => {
        setId(value)
      }}
    >
      <option disabled={true}>my teams</option>
      {teamState.myTeams.data?.map(team => {
        return (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        )
      })}
      {/* <option>add new my team</option> */}
      {teamState.memberTeams.data?.length && (
        <>
          <option disabled={true}>member teams</option>
          {teamState.memberTeams.data?.map(team => {
            return (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            )
          })}
        </>
      )}
    </select>
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
            <OpenTeamButton />
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
