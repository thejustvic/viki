import {useReactionsHandlers} from './reactions/use-reactions-handlers'
import {Message} from './types'

interface Handlers {
  putHeart: (message: Message) => Promise<void>
}

export const useChatMessageHandlers = (): Handlers => {
  const {selectReaction} = useReactionsHandlers()

  const putHeart: Handlers['putHeart'] = async message => {
    await selectReaction('❤️', message)
  }

  return {
    putHeart
  }
}
