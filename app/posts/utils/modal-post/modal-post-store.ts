import {Query} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoObservable, observable} from 'mobx'
import {Post} from '../types'

interface State {
  post: Query<Post>
}

export class ModalPostStore {
  state: State = {
    post: {
      loading: false,
      data: null,
      error: null
    }
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setPost = (post: State['post']): void => {
    this.state.post = post
  }
}

const [ModalPostStoreContext, useModalPostStore] =
  createUseStore<ModalPostStore>()
export {ModalPostStoreContext, useModalPostStore}
