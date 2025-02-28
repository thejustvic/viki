import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import type {Post} from './types'

interface State {
  posts: Post[]
  searchValue: string
}

export class PostsStore {
  state: State = {
    posts: [],
    searchValue: ''
  }

  constructor(serverPosts: Post[]) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    this.setPosts(serverPosts)
  }

  setPosts(posts: Post[]): void {
    this.state.posts = Util.sortByDate(posts)
  }

  handleUpdate = (oldPost: Post, newPost: Post): void => {
    this.setPosts(
      this.state.posts.map(post => {
        if (post.id === oldPost.id) {
          return newPost
        }
        return post
      })
    )
  }

  handleInsert = (newPost: Post): void => {
    this.setPosts([...this.state.posts, newPost])
  }

  handleDelete = (oldPost: Post): void => {
    const posts = Util.clone(this.state.posts)
    this.setPosts(posts.filter(post => post.id !== oldPost.id))
  }

  setSearchValue = (value: string) => {
    this.state.searchValue = value
  }

  searchedPosts = () => {
    const posts = Util.clone(this.state.posts)
    return posts.filter(post => post.text.includes(this.state.searchValue))
  }
}

const [PostsContext, usePostsStore] = createUseStore<PostsStore>()
export {PostsContext, usePostsStore}
