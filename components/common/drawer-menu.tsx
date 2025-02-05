import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'
import {Chat} from '../chat/chat'
import {ChatInput} from '../chat/chat-input'
import {Button} from '../daisyui/button'
import {useGlobalStore} from '../global/global-store'
import {Drag} from './drag'

const TwMenu = tw.div`
  border
  border-y-0
  border-base-300
  bg-base-100
  text-base-content
  flex
  flex-col
  flex-nowrap
  h-full
`

export const DrawerMenu = observer(() => {
  const [state, store] = useGlobalStore()

  const closeDrawer = () => {
    store.setLeftDrawerClosed()
  }

  return (
    <TwMenu style={{width: state.leftDrawerWidth}}>
      <Drag drawer="left" />
      <div>
        <Button color="ghost" className="w-full text-xl" onClick={closeDrawer}>
          hobby
        </Button>
        <div className="divider" />
      </div>
      <div className="flex flex-col justify-between flex-1 gap-3">
        <Chat />
        <ChatInput />
      </div>
    </TwMenu>
  )
})
