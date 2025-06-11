'use client'

import {useCardsStore} from '@/components/cards/cards-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {UserImage} from '@/components/common/user-image'
import {Button} from '@/components/daisyui/button'
import {Dropdown} from '@/components/daisyui/dropdown'
import {Navbar as Nav} from '@/components/daisyui/navbar'
import {Toggle} from '@/components/daisyui/toggle'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {SwitchTheme} from '@/components/switch-theme'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconSearch} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/navigation'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import {NavbarLeftDrawerButton} from './navbar-left-drawer-button'
import {NavbarOpenTeamButton} from './navbar-open-team-button'
import {NavbarRightDrawerButton} from './navbar-right-drawer-button'
import {NavbarTeamSelect} from './navbar-team-select'

export const Navbar = observer(() => {
  const {user} = useSupabase()

  return (
    <Nav
      style={{height: headerHeight}}
      className={twJoin(
        'sticky top-0 z-10 px-0 bg-base-200 gap-6',
        user ? 'justify-between' : 'justify-center'
      )}
    >
      {user && !isMobile ? <NavStart /> : null}
      {user ? <NavCenter /> : null}
      {user ? <NavEnd /> : null}
    </Nav>
  )
})

const NavStart = () => {
  const cardId = getSearchCard()

  if (isMobile) {
    return
  }

  return (
    <Nav.Start>
      {cardId && <NavbarLeftDrawerButton />}
      <div className="ml-4 flex gap-2 items-center">
        <NavbarTeamSelect />
        <NavbarOpenTeamButton />
      </div>
    </Nav.Start>
  )
}

const NavCenter = () => {
  return (
    <Nav.Center className={twJoin('font-mono text-lg', isMobile && 'ml-4')}>
      <Search />
    </Nav.Center>
  )
}

const Search = observer(() => {
  const [state, store] = useCardsStore()

  return (
    <label className="input input-info border-none">
      <IconSearch />
      <input
        type="search"
        placeholder="Search"
        onChange={e => store.setSearchValue(e.target.value)}
        value={state.searchValue}
        className="truncate"
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
        <NavbarRightDrawerButton />
      </div>
    </Nav.End>
  )
}

const AvatarDropdown = observer(() => {
  const [state, store] = useGlobalStore()
  const {supabase, user} = useSupabase()
  const cardId = getSearchCard()
  const route = useRouter()

  const handleLogout = async () => {
    store.setLogging('logout')
    await supabase.auth.signOut()
    store.setLoggingOff()
    route.push('/login')
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
        {cardId && <LabelShowLeftMenu />}
        {isMobile && (
          <div className="flex gap-1 items-center">
            <NavbarTeamSelect />
            <NavbarOpenTeamButton />
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
