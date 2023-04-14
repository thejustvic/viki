import {SwitchTheme} from '@/components/switch-theme'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconMenu} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import Image from 'next/image'
import {Button, Dropdown, Navbar as Nav} from 'react-daisyui'
import {useGlobalStore} from '../global/global-store'

export const Navbar = observer(() => {
  const [, store] = useGlobalStore()

  const drawerOpen = () => {
    store.setDrawerOpen()
  }

  return (
    <Nav
      className="sticky top-0 z-10 bg-base-200"
      style={{height: headerHeight}}
    >
      <Nav.Start>
        <Button color="ghost" onClick={drawerOpen}>
          <div className="text-lg normal-case">
            <IconMenu />
          </div>
        </Button>
      </Nav.Start>

      <Nav.Center className="font-mono text-lg">viki</Nav.Center>

      <Nav.End className="gap-2">
        <SwitchTheme />
        <Avatar />
      </Nav.End>
    </Nav>
  )
})

const Avatar = () => {
  const {supabase, session} = useSupabase()
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  if (!session) {
    return null
  }

  return (
    <Dropdown vertical="end" hover>
      <Button color="ghost" className="avatar" shape="circle">
        <Image
          width={46}
          height={46}
          src={session.user.user_metadata?.avatar_url}
          alt="avatar-url"
          className="rounded-full"
        />
      </Button>
      <Dropdown.Menu className="shadow-lg w-52">
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
