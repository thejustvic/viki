import {observer} from 'mobx-react-lite'
import Link from 'next/link'
import {Button, Divider, Menu} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {Chat} from '../chat/chat'
import {ChatInput} from '../chat/chat-input'
import {useGlobalStore} from '../global/global-store'

const TwMenu = tw(Menu)`
  border
  border-base-300
  bg-base-100 
  text-base-content 
  overflow-y-auto 
  w-80 
  p-2
  flex-nowrap
`

export const DrawerMenu = observer(() => {
  const [, store] = useGlobalStore()

  const closeDrawer = () => {
    store.setDrawerClosed()
  }

  return (
    <TwMenu vertical>
      <div>
        <Link href="/">
          <Button
            color="ghost"
            className="w-full text-xl"
            onClick={closeDrawer}
          >
            viki
          </Button>
        </Link>
        <Divider />
      </div>
      <div className="flex flex-col justify-between flex-1 gap-3">
        <Chat />
        <ChatInput />
      </div>
    </TwMenu>
  )
})
