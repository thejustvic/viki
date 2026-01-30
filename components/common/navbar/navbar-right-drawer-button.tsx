import {useCheckCardExistInCurrentTeam} from '@/components/cards/use-cards-listener'
import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconArrowBarLeft, IconArrowBarRight} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'

export const NavbarRightDrawerButton = observer(() => {
  const [state, store] = useGlobalStore()
  useCheckCardExistInCurrentTeam()

  const toggleRightDrawer = () => {
    store.setRightDrawerToggle()
  }

  return (
    <Button
      className="rounded-none rounded-l-md"
      color="ghost"
      size="sm"
      onClick={toggleRightDrawer}
    >
      <div className="text-lg normal-case">
        {state.rightDrawerOpen ? <IconArrowBarRight /> : <IconArrowBarLeft />}
      </div>
    </Button>
  )
})
