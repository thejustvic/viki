import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import {Message, Profile} from './types'

interface State {
  chat: SupabaseQuery<Message[]>
  usersWhoReacted: Profile[]
}

export class ChatStore {
  state: State = {
    chat: {
      loading: false,
      data: null,
      error: null
    },
    usersWhoReacted: []
  }

  constructor(serverChat: Message[]) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    this.setChat({loading: false, data: serverChat, error: null})
  }

  setChat(chat: State['chat']): void {
    this.state.chat = chat
  }

  setUsersWhoReacted(users: State['usersWhoReacted']): void {
    this.state.usersWhoReacted = users
  }

  handleUpdate = (oldMessage: Message, newMessage: Message): void => {
    const messages = this.state.chat.data?.map(message => {
      if (message.id === oldMessage.id) {
        return newMessage
      }
      return message
    })
    if (messages) {
      this.setChat({
        ...this.state.chat,
        data: messages
      })
    }
  }

  handleInsert = (newMessage: Message): void => {
    if (this.state.chat.data) {
      this.setChat({
        ...this.state.chat,
        data: [...this.state.chat.data, newMessage]
      })
    }
  }

  handleDelete = (oldMessage: Message): void => {
    const messages = Util.clone(this.state.chat.data)
    if (messages) {
      this.setChat({
        ...this.state.chat,
        data: messages.filter(message => message.id !== oldMessage.id)
      })
    }
  }
}

const [ChatContext, useChatStore] = createUseStore<ChatStore>()
export {ChatContext, useChatStore}
