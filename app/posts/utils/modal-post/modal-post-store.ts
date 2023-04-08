import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {PostgrestError} from '@supabase/postgrest-js'
import {makeAutoObservable, observable} from 'mobx'
import {Post} from '../types'

interface State {
  post: {
    load: boolean
    data: Post | null
    error: PostgrestError | null
  }
}

export class ModalPostStore {
  state: State = {
    post: {
      load: false,
      data: null,
      error: null
    }
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setPost(post: State['post']): void {
    this.state.post = post
  }
}

const [ModalPostStoreContext, useModalPostStore] =
  createUseStore<ModalPostStore>()
export {ModalPostStoreContext, useModalPostStore}
