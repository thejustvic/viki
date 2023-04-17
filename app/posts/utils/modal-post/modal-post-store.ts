import {FetchQuery} from '@/hooks/use-fetch'
import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {User} from '@supabase/auth-helpers-nextjs'
import {makeAutoObservable, observable} from 'mobx'
import {Post} from '../types'

interface State {
  post: SupabaseQuery<Post>
  postCreator: FetchQuery<User>
}

export class ModalPostStore {
  state: State = {
    post: {
      loading: false,
      data: null,
      error: null
    },
    postCreator: {
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

  setPostCreator = (postCreator: State['postCreator']): void => {
    this.state.postCreator = postCreator
  }
}

const [ModalPostStoreContext, useModalPostStore] =
  createUseStore<ModalPostStore>()
export {ModalPostStoreContext, useModalPostStore}
