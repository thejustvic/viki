import {getSearchCard} from '@/components/cards/get-search-card'
import {ChatBase} from '@/components/chat/chat'
import {ChatInput} from '@/components/chat/chat-input'
import {DragDrawerSide} from '@/components/common/drag-drawer-side/drag-drawer-side'
import tw from '@/components/common/tw-styled-components'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {minDrawerWidth} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {isMobile} from 'react-device-detect'

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
  const [state, store] = useGlobalStore()

  useEffect(() => {
    if (isMobile) {
      return
    }
    if (state.leftDrawerWidth >= window.innerWidth) {
      store.setLeftDrawerWidth(minDrawerWidth)
    }
  }, [state.leftDrawerWidth])

  return (
    <TwMenu style={isMobile ? {} : {width: state.leftDrawerWidth}}>
      <DragDrawerSide drawer="left" />
      <ChatWrapper />
    </TwMenu>
  )
})

const TwChatWrapper = tw.div`
  relative
  h-full
`

const TwChatBase = tw.div`
  flex
  flex-col
  justify-between
  flex-1
  gap-3
  pt-6
  h-full
  pb-16
`

const TwChatInput = tw.div`
  absolute
  bottom-0
  right-0
  left-0
`

export const ChatWrapper = () => {
  const cardId = getSearchCard()
  return (
    <TwChatWrapper>
      <TwChatBase>
        <ChatBase />
      </TwChatBase>
      {cardId && (
        <TwChatInput>
          <ChatInput />
        </TwChatInput>
      )}
    </TwChatWrapper>
  )
}
