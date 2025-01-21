import {SwitchTheme} from '@/components/switch-theme'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import {IconArrowBarLeft, IconArrowBarRight} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {Button, Dropdown, Navbar as Nav, Toggle} from 'react-daisyui'
import {useGlobalStore} from '../global/global-store'
import {UserImage} from './user-image'

export const Navbar = observer(() => {
  const {session} = useSupabase()

  return (
    <Nav
      className="sticky top-0 z-10 px-0 bg-base-200"
      style={{height: headerHeight}}
    >
      {session ? <NavStart /> : null}
      <NavCenter />
      {session ? <NavEnd /> : null}
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
        <div className="text-lg normal-case">
          {state.leftDrawerOpen ? <IconArrowBarLeft /> : <IconArrowBarRight />}
        </div>
      </Button>
    </Nav.Start>
  )
})

const NavCenter = () => {
  return (
    <Nav.Center className="flex justify-center flex-1 font-mono text-lg">
      viki
    </Nav.Center>
  )
}

const NavEnd = observer(() => {
  const [state, store] = useGlobalStore()

  const searchParams = useSearchParams()
  const postId = searchParams.get('post')

  const router = useRouter()
  const pathname = usePathname()

  const toggleRightDrawer = () => {
    store.setRightDrawerToggle()
    if (postId) {
      store.setLastPostId(postId)
      const queryString = Util.deleteQueryParam(searchParams, 'post')
      Util.routerPushQuery(router, queryString, pathname)
    } else if (state.lastPostId) {
      const queryString = Util.addQueryParam(
        searchParams,
        'post',
        state.lastPostId
      )
      Util.routerPushQuery(router, queryString, pathname)
    }
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
