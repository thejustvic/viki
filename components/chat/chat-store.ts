import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import {Message} from './types'

interface State {
  messages: Message[]
}

export class ChatStore {
  state: State = {
    messages: []
  }

  constructor(serverChat: Message[]) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    this.setChat(serverChat)
  }

  setChat(messages: Message[]): void {
    this.state.messages = messages
  }

  handleUpdate = (oldMessage: Message, newMessage: Message): void => {
    this.setChat(
      this.state.messages.map(message => {
        if (message.id === oldMessage.id) {
          return newMessage
        }
        return message
      })
    )
  }

  handleInsert = (newMessage: Message): void => {
    this.setChat([...this.state.messages, newMessage])
  }

  handleDelete = (oldMessage: Message): void => {
    const messages = Util.clone(this.state.messages)
    this.setChat(messages.filter(message => message.id !== oldMessage.id))
  }
}

const [ChatContext, useChatStore] = createUseStore<ChatStore>()
export {ChatContext, useChatStore}
