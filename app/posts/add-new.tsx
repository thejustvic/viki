import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Button} from 'react-daisyui'

export const AddNew = () => {
  const {supabase} = useSupabase()
  const insert = async () => {
    await supabase
      .from('posts')
      .insert({text: (Math.random() + 1).toString(36).substring(7)})
  }
  return (
    <Button responsive className="px-2" onClick={insert}>
      insert
    </Button>
  )
}
