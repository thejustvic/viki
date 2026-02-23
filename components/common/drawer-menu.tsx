import {getSearchCard} from '@/components/cards/get-search-card'
import {ChatBase} from '@/components/chat/chat'
import {ChatInput} from '@/components/chat/chat-input'
import {DragDrawerSide} from '@/components/common/drag-drawer-side/drag-drawer-side'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {observer} from 'mobx-react-lite'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'

const TwMenu = tw.div`
  border
  border-y-0
  border-base-300
  bg-base-300/70
  text-base-content
  flex
  flex-col
  flex-nowrap
  h-full
`

export const DrawerMenu = observer(() => {
  const [state] = useGlobalStore()

  return (
    <TwMenu style={isMobile ? {} : {width: state.leftDrawerWidth}}>
      <DragDrawerSide drawer="left" />
      <ChatWrapper />
    </TwMenu>
  )
})

export const ChatWrapper = () => {
  const cardId = getSearchCard()
  return (
    <div className="relative h-full">
      <div className="flex flex-col justify-between flex-1 gap-3 pt-6 h-full pb-16">
        <ChatBase />
      </div>
      {cardId && (
        <div className="absolute bottom-0 right-0 left-0">
          <ChatInput />
        </div>
      )}
    </div>
  )
}
