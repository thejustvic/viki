import {getSearchCard} from '@/components/cards/get-search-card'
import {Chat} from '@/components/chat/chat'
import {ChatInput} from '@/components/chat/chat-input'
import {Drag} from '@/components/common/drag/drag'
import {useGlobalStore} from '@/components/global/global-store'
import {observer} from 'mobx-react-lite'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'

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
  const [state] = useGlobalStore()

  return (
    <TwMenu style={isMobile ? {} : {width: state.leftDrawerWidth}}>
      <Drag drawer="left" />
      <ChatWrapper />
    </TwMenu>
  )
})

export const ChatWrapper = () => {
  const cardId = getSearchCard()
  return (
    <div className="flex flex-col justify-between flex-1 gap-3 pt-6">
      <Chat />
      {cardId && <ChatInput />}
    </div>
  )
}
