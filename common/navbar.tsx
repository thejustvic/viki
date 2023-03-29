import {SwitchTheme} from '@/components/switch-theme'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconMenu} from '@tabler/icons-react'
import Image from 'next/image'
import {Button, Dropdown, Navbar as Nav} from 'react-daisyui'

interface Props {
  toggleMenu: () => void
}

export const Navbar = ({toggleMenu}: Props) => {
  return (
    <Nav className="bg-base-200">
      <Nav.Start>
        <Button color="ghost" onClick={toggleMenu}>
          <div className="normal-case text-lg">
            <IconMenu />
          </div>
        </Button>
      </Nav.Start>

      <Nav.Center className="text-lg font-mono">viki</Nav.Center>

      <Nav.End className="gap-2">
        <SwitchTheme />
        <Avatar />
      </Nav.End>
    </Nav>
  )
}

const Avatar = () => {
  const {supabase, session} = useSupabase()
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  if (!session) {
    return null
  }

  return (
    <Dropdown vertical="end">
      <Button color="ghost" className="avatar" shape="circle">
        <Image
          width={46}
          height={46}
          src={session.user.user_metadata?.avatar_url}
          alt="avatar-url"
          className="rounded-full"
        />
      </Button>
      <Dropdown.Menu className="w-52 shadow-lg">
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
