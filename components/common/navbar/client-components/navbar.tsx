'use client'

import {getSearchPost} from '@/app/posts/components/get-search-post'
import {SwitchTheme} from '@/components/switch-theme'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconArrowBarLeft, IconArrowBarRight} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {Button} from '../../../daisyui/button'
import {Dropdown} from '../../../daisyui/dropdown'
import {Navbar as Nav} from '../../../daisyui/navbar'
import {Toggle} from '../../../daisyui/toggle'
import {useGlobalStore} from '../../../global/global-store'
import {UserImage} from '../../user-image'

export const Navbar = observer(() => {
  const {user} = useSupabase()
  const postId = getSearchPost()

  return (
    <Nav
      className="sticky top-0 z-10 px-0 bg-base-200"
      style={{height: headerHeight}}
    >
      {user && postId ? <NavStart /> : <Nav.Start />}
      <NavCenter />
      {user ? <NavEnd /> : <Nav.End />}
    </Nav>
  )
})

const NavStart = observer(() => {
  const [state, store] = useGlobalStore()

  return (
    <Nav.Start>
      <Button
        className="rounded-none rounded-r-md"
        color="ghost"
        size="sm"
        onClick={store.setLeftDrawerToggle}
      >
        {state.leftDrawerOpen ? <IconArrowBarLeft /> : <IconArrowBarRight />}
      </Button>
    </Nav.Start>
  )
})

const NavCenter = () => {
  return <Nav.Center className="font-mono text-lg">hobby</Nav.Center>
}

const NavEnd = observer(() => {
  const [state, store] = useGlobalStore()

  const toggleRightDrawer = () => {
    store.setRightDrawerToggle()
  }

  return (
    <Nav.End className="gap-2">
      <div className="flex items-center gap-6">
        <div className="flex">
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
  const {supabase, user} = useSupabase()
  const postId = getSearchPost()

  const handleLogout = async () => {
    await supabase.auth.signOut()
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
        <Dropdown.Item className="flex">
          {postId && <LabelShowLeftMenu />}
        </Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
})

const LabelShowLeftMenu = observer(() => {
  const [state, store] = useGlobalStore()
  return (
    <label className="fieldset-label">
      <span className="truncate">show left menu on hover</span>
      <Toggle
        checked={state.showLeftMenuOnHover}
        onChange={store.setShowLeftMenuOnHoverToggle}
      />
    </label>
  )
})
