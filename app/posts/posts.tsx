'use client'

import {TwContainer} from './containers'
import {Post} from './types'
import {usePosts} from './use-posts'

export default function Posts({serverPosts}: {serverPosts: Post[]}) {
  const posts = usePosts({serverPosts})
  return (
    <TwContainer>
      {posts.map(post => {
        return <div>{post.text}</div>
      })}
    </TwContainer>
  )
}
