'use client'

import {useGlobalStore} from '@/common/global/global-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {Button} from 'react-daisyui'
import {implementTheme} from './utils/implement-theme'
import {updateTheme} from './utils/update-theme'

export const SwitchTheme = observer(() => {
  const {supabase, session} = useSupabase()
  const [state, store] = useGlobalStore()

  const toggleTheme = async () => {
    const theme = await updateTheme({
      theme: state.theme === 'dark' ? 'garden' : 'dark',
      opts: {supabase, session}
    })
    implementTheme(store, theme)
  }

  if (!session) {
    return null
  }

  return (
    <Button color="ghost" onClick={toggleTheme} loading={!Boolean(state.theme)}>
      {state.theme}
    </Button>
  )
})
