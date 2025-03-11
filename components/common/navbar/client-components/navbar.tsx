'use client'

import {getSearchPost} from '@/app/posts/components/get-search-post'
import {usePostsStore} from '@/app/posts/components/posts-store'
import {SwitchTheme} from '@/components/switch-theme'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconSearch} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {isMobile} from 'react-device-detect'
import {Button} from '../../../daisyui/button'
import {Dropdown} from '../../../daisyui/dropdown'
import {Navbar as Nav} from '../../../daisyui/navbar'
import {Toggle} from '../../../daisyui/toggle'
import {useGlobalStore} from '../../../global/global-store'
import {UserImage} from '../../user-image'
import {LeftDrawerButton} from './left-drawer-button'
import {RightDrawerButton} from './right-drawer-button'
import {TeamSelect} from './team-select'

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

const NavEnd = () => {
  return (
    <Nav.End className="gap-2">
      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <SwitchTheme />
          <AvatarDropdown />
        </div>
        <RightDrawerButton />
      </div>
    </Nav.End>
  )
}

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
