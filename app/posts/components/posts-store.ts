import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import type {Post} from './types'

interface State {
  posts: SupabaseQuery<Post[]>
  searchValue: string
}

export class PostsStore {
  state: State = {
    posts: {
      loading: false,
      data: null,
      error: null
    },
    searchValue: ''
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setPosts(posts: State['posts']): void {
    this.state.posts = posts
  }

  handleUpdate = (oldPost: Post, newPost: Post): void => {
    const posts = this.state.posts.data?.map(post => {
      if (post.id === oldPost.id) {
        return newPost
      }
      return post
    })
    if (posts) {
      this.setPosts({
        ...this.state.posts,
        data: posts
      })
    }
  }

  handleInsert = (newPost: Post): void => {
    if (!this.state.posts.data) {
      return
    }
    this.setPosts({
      ...this.state.posts,
      data: [...this.state.posts.data, newPost]
    })
  }

  handleDelete = (oldPost: Post): void => {
    const posts = Util.clone(this.state.posts.data)
    if (posts) {
      this.setPosts({
        ...this.state.posts,
        data: posts.filter(message => message.id !== oldPost.id)
      })
    }
  }

  setSearchValue = (value: string): void => {
    this.state.searchValue = value
  }

  searchedPosts = (): Post[] => {
    const posts = Util.clone(this.state.posts.data)
    if (!posts) {
      return []
    }
    return posts.filter(post => post.text.includes(this.state.searchValue))
  }
}

const [PostsContext, usePostsStore] = createUseStore<PostsStore>()
export {PostsContext, usePostsStore}
