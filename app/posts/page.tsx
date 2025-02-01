import 'server-only'

import {Load} from '@/components/common/load'
import {createClient} from '@/utils/supabase-utils/supabase-server'
import {Suspense} from 'react'
import {Posts} from './components/posts'

// do not cache this page
export const revalidate = 0

const fetchData = async () => {
  const supabase = await createClient()
  const {data} = await supabase.from('posts').select('*')
  return data
}

export default async function PostsPage() {
  const data = await fetchData()

  return (
    <Suspense fallback={<Load center />}>
      <Posts serverPosts={data || []} />
    </Suspense>
  )
}
