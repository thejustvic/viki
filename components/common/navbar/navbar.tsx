'use client'

import {getSearchCard} from '@/components/cards/get-search-card'
import {UserImage} from '@/components/common/user-image'
import {Button} from '@/components/daisyui/button'
import {Dropdown} from '@/components/daisyui/dropdown'
import {Navbar as Nav} from '@/components/daisyui/navbar'
import {Toggle} from '@/components/daisyui/toggle'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {SwitchTheme} from '@/components/switch-theme'
import {useResize} from '@/hooks/use-resize'
import {headerHeight, minDrawerWidth, minNavbarWidth} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import {NavbarLeftDrawerButton} from './navbar-left-drawer-button'
import {NavbarOpenTeamButton} from './navbar-open-team-button'
import {NavbarRightDrawerButton} from './navbar-right-drawer-button'
import {NavbarSearch} from './navbar-search'
import {NavbarTeamSelect, useTeamSync} from './navbar-team-select'

export const Navbar = observer(() => {
  useTeamSync()

  const [globalState, globalStore] = useGlobalStore()
  const {ref, width: navbarWidth} = useResize()

  useEffect(() => {
    globalStore.setNavbarWidth(navbarWidth)
    const widthMargin = 100
    // adjusting drawer width to navbar width
    if (navbarWidth < minNavbarWidth - widthMargin) {
      const widthThatIsNotEnough = minNavbarWidth - navbarWidth
      const newRightDrawerWidth =
        globalState.rightDrawerWidth - widthThatIsNotEnough
      if (newRightDrawerWidth >= minDrawerWidth) {
        globalStore.setLeftDrawerWidth(minDrawerWidth)
        globalStore.setRightDrawerWidth(newRightDrawerWidth)
      } else {
        const newLeftDrawerWidth =
          globalState.leftDrawerWidth - widthThatIsNotEnough
        if (newLeftDrawerWidth >= minDrawerWidth) {
          globalStore.setRightDrawerWidth(minDrawerWidth)
          globalStore.setLeftDrawerWidth(newLeftDrawerWidth)
        }
      }
    }
  }, [navbarWidth])

  const cardId = getSearchCard()
  return (
    <Nav
      ref={ref}
      style={{height: headerHeight}}
      className={twJoin(
        'sticky top-0 z-10 px-0 bg-base-200 gap-6 justify-between'
      )}
    >
      {navbarWidth > 650 ? (
        <>
          <NavStart />
          <NavCenter />
          <NavEnd />
        </>
      ) : (
        <>
          {cardId && !isMobile && <NavbarLeftDrawerButton />}
          <NavCenter />
          <NavEndMobile />
        </>
      )}
    </Nav>
  )
})

const NavStart = () => {
  const cardId = getSearchCard()

  return (
    <Nav.Start>
      {cardId && !isMobile && <NavbarLeftDrawerButton />}
      <div className="ml-4 flex gap-2 items-center">
        <NavbarTeamSelect />
        <NavbarOpenTeamButton />
      </div>
    </Nav.Start>
  )
}

const NavCenter = () => {
  return (
    <Nav.Center
      className={twJoin('font-mono text-lg w-full', isMobile && 'ml-4')}
    >
      <NavbarSearch />
    </Nav.Center>
  )
}

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

const NavEndMobile = () => {
  return (
    <Nav.End className="gap-2">
      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <SwitchTheme />
          <AvatarDropdownMobile />
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

  const handleLogout = async () => {
    store.setLogging('logout')
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) {
    return null
  }

  return (
    <Dropdown placements={['end']} hover>
      <UserImage src={user.user_metadata?.avatar_url} />
      <Dropdown.Menu className="shadow-lg bg-base-200 gap-4">
        {cardId && <LabelShowLeftMenu />}
        <Button
          soft
          color="info"
          onClick={handleLogout}
          disable={state.logging.logout}
          loading={state.logging.logout}
        >
          Logout
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  )
})

const AvatarDropdownMobile = observer(() => {
  const [state, store] = useGlobalStore()
  const {supabase, user} = useSupabase()

  const handleLogout = async () => {
    store.setLogging('logout')
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) {
    return null
  }

  return (
    <Dropdown placements={['end']} hover>
      <UserImage src={user.user_metadata?.avatar_url} />
      <Dropdown.Menu className="shadow-lg bg-base-200 gap-4">
        <div className="flex gap-1 items-center">
          <NavbarTeamSelect />
          <NavbarOpenTeamButton />
        </div>
        <Button
          soft
          color="info"
          onClick={handleLogout}
          disable={state.logging.logout}
          loading={state.logging.logout}
        >
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
