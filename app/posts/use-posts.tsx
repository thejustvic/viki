'use client'

import {useSupabase} from '@/utils/supabase-provider'
import {useEffect, useState} from 'react'
import {Post} from './types'

interface Props {
  serverPosts: Post[]
}

export const usePosts = ({serverPosts}: Props) => {
  const {supabase} = useSupabase()
  const [posts, setPosts] = useState(serverPosts)

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'posts'},
        payload => {
          switch (payload.eventType) {
            case 'DELETE':
              handleDelete(payload.old as Post)
            case 'INSERT':
              handleInsert(payload.new as Post)
            case 'UPDATE':
              handleUpdate(payload.old as Post, payload.new as Post)
          }
          console.info(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setPosts, posts])

  const handleUpdate = (oldPost: Post, newPost: Post) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === oldPost.id) {
          return newPost
        }

        return post
      })
    )
  }

  const handleInsert = (newPost: Post) => {
    setPosts(posts => [...posts, newPost])
  }

  const handleDelete = (oldPost: Post) => {
    setPosts(posts => posts.filter(post => post.id !== oldPost.id))
  }

  return posts
}
