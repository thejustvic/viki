import {observer} from 'mobx-react-lite'
import {Button, Divider} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {Chat} from '../chat/chat'
import {ChatInput} from '../chat/chat-input'
import {useGlobalStore} from '../global/global-store'
import {Drag} from './drag'

const TwMenu = tw.div`
  border
  border-base-300
  bg-base-100
  text-base-content
  overflow-y-auto
  p-2
  flex
  flex-col
  flex-nowrap
`

export const DrawerMenu = observer(() => {
  const [state, store] = useGlobalStore()

  const closeDrawer = () => {
    store.setLeftDrawerClosed()
  }

  return (
    <TwMenu>
      <Drag drawer="left" />
      <div>
        <Button color="ghost" className="w-full text-xl" onClick={closeDrawer}>
          hobby
        </Button>
        <Divider />
      </div>
      <div
        className="flex flex-col justify-between flex-1 gap-3"
        style={{width: state.leftDrawerWidth}}
      >
        <Chat />
        <ChatInput />
      </div>
    </TwMenu>
  )
})
