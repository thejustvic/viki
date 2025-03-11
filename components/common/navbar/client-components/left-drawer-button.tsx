import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global/global-store'
import {IconArrowBarLeft, IconArrowBarRight} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'

export const LeftDrawerButton = observer(() => {
  const [state, store] = useGlobalStore()

  return (
    <Button
      className="rounded-none rounded-r-md"
      color="ghost"
      size="sm"
      onClick={store.setLeftDrawerToggle}
    >
      {state.leftDrawerOpen ? <IconArrowBarLeft /> : <IconArrowBarRight />}
    </Button>
  )
})
