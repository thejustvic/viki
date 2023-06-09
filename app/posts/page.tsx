import 'server-only'

import {createClient} from '@/utils/supabase-utils/supabase-server'
import {Posts} from './utils/posts'

// do not cache this page
export const revalidate = 0

const fetchData = async () => {
  const supabase = createClient()
  const {data} = await supabase.from('posts').select('*')
  return data
}

export default async function MyPosts() {
  const data = await fetchData()

  return <Posts serverPosts={data || []} />
}
