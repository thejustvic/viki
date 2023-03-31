'use client'

import {Load} from '@/common/load'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconCircleX} from '@tabler/icons-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {Button, Modal} from 'react-daisyui'
import {Post} from './types'

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
    <Modal open={open} onClickBackdrop={goBack}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={goBack}
        color="ghost"
      >
        <IconCircleX />
      </Button>
      <Modal.Header className="font-bold">Post:</Modal.Header>

      <Modal.Body>
        {post?.text ?? <Load className="h-6 w-6 p-0 flex items-start" />}
      </Modal.Body>
    </Modal>
  )
}
