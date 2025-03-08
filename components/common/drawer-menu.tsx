import {getSearchPost} from '@/app/posts/components/get-search-post'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'
import {Chat} from '../chat/chat'
import {ChatInput} from '../chat/chat-input'
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
  const [state] = useGlobalStore()
  const postId = getSearchPost()

  return (
    <TwMenu style={{width: state.leftDrawerWidth}}>
      <Drag drawer="left" />
      <div className="flex flex-col justify-between flex-1 gap-3 pt-6">
        <Chat />
        {postId && <ChatInput />}
      </div>
    </TwMenu>
  )
})
