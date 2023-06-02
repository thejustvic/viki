import {SwitchTheme} from '@/components/switch-theme'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import {IconArrowBarLeft, IconArrowBarRight} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button, Dropdown, Navbar as Nav, Toggle} from 'react-daisyui'
import {useGlobalStore} from '../global/global-store'
import {UserImage} from './user-image'

export const Navbar = observer(() => {
  const [state, store] = useGlobalStore()

  const searchParams = useSearchParams()
  const postId = searchParams.get('post')

  const router = useRouter()
  const goBack = () => {
    const queryString = Util.deleteQueryParam(searchParams, 'post')
    router.push(`/${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <Nav
      className="sticky top-0 z-10 px-0 bg-base-200"
      style={{height: headerHeight}}
    >
      <Nav.Start>
        <Button
          className="rounded-none rounded-r-md"
          color="ghost"
          size="sm"
          onClick={store.setDrawerToggle}
        >
          <div className="text-lg normal-case">
            {state.drawerOpen ? <IconArrowBarLeft /> : <IconArrowBarRight />}
          </div>
        </Button>
      </Nav.Start>

      <Nav.Center className="font-mono text-lg">viki</Nav.Center>

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
            onClick={goBack}
          >
            <div className="text-lg normal-case">
              {postId ? <IconArrowBarRight /> : <IconArrowBarLeft />}
            </div>
          </Button>
        </div>
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
