import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconArrowBarLeft, IconArrowBarRight} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'

export const NavbarRightDrawerButton = observer(() => {
  const [state, store] = useGlobalStore()

  const toggleRightDrawer = () => {
    store.setRightDrawerToggle()
  }

  return (
    <Button
      soft
      className="rounded-none rounded-l-md"
      size="sm"
      onClick={toggleRightDrawer}
    >
      <div className="text-lg normal-case">
        {state.rightDrawerOpen ? <IconArrowBarRight /> : <IconArrowBarLeft />}
      </div>
    </Button>
  )
})
