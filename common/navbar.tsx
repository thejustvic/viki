import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import Image from 'next/image'
import {Button, Divider, Dropdown, Navbar as Nav} from 'react-daisyui'

interface Props {
  toggleMenu: () => void
}

export default function Navbar({toggleMenu}: Props) {
  const {supabase, session} = useSupabase()
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Nav className="bg-base-100">
        <Nav.Start>
          <Button color="ghost" onClick={toggleMenu}>
            <div className="normal-case text-lg">Menu</div>
          </Button>
        </Nav.Start>

        <Nav.Center className="text-lg font-mono">viki</Nav.Center>

        <Nav.End>
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
            <Dropdown.Menu className="w-52 menu-compact">
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav.End>
      </Nav>

      <Divider className="my-0" />
    </>
  )
}
