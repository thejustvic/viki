'use client'

import {Load} from '@/common/load'
import {Modal} from '@/common/modal'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'

import {Post} from './types'

const TwLoad = tw(Load)`
  h-6 
  w-6 
  p-0 
  flex 
  items-start
`

export const PostModal = ({
  postId,
  open
}: {
  postId: string | null
  open: boolean
}) => {
  const router = useRouter()
  const {supabase} = useSupabase()
  const [post, set] = useState<Post | null>()

  useEffect(() => {
    if (!postId) {
      return
    }
    const fetch = async () => {
      const {data} = await supabase
        .from('posts')
        .select()
        .match({id: postId})
        .single()

      set(data)
    }
    fetch()
    return () => set(null)
  }, [postId])

  const goBack = () => {
    router.push('/')
  }

  return (
    <Modal
      open={open}
      goBack={goBack}
      header={() => <>{'Post:'}</>}
      body={() => <>{post?.text ?? <TwLoad />}</>}
    />
  )
}
