import {SwitchTheme} from '@/components/switch-theme'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import {IconMenu} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {Button, Dropdown, Navbar as Nav, Toggle} from 'react-daisyui'
import {useGlobalStore} from '../global/global-store'
import {UserImage} from './user-image'

export const Navbar = observer(() => {
  const [, store] = useGlobalStore()

  return (
    <Nav
      className="sticky top-0 z-10 bg-base-200"
      style={{height: headerHeight}}
    >
      <Nav.Start>
        <Button color="ghost" onClick={store.setDrawerToggle}>
          <div className="text-lg normal-case">
            <IconMenu />
          </div>
        </Button>
      </Nav.Start>

      <Nav.Center className="font-mono text-lg">viki</Nav.Center>

      <Nav.End className="gap-2">
        <SwitchTheme />
        <AvatarDropdown />
      </Nav.End>
    </Nav>
  )
})

const AvatarDropdown = observer(() => {
  const [state, store] = useGlobalStore()
  const {supabase, session} = useSupabase()
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  if (!session) {
    return null
  }

  return (
    <Dropdown vertical="end" hover>
      <Button color="ghost" shape="square">
        <UserImage src={session.user.user_metadata?.avatar_url} />
      </Button>
      <Dropdown.Menu className="shadow-lg">
        <Dropdown.Item onClick={store.setShowLeftMenuOnHoverToggle}>
          <Toggle checked={state.showLeftMenuOnHover} onChange={Util.noop} />
          <span className="truncate">show left menu on hover</span>
        </Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
})
