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
    const newTheme = state.theme === 'dark' ? 'garden' : 'dark'
    const themeRes = await updateTheme(newTheme, {supabase, session})
    implementTheme(store, themeRes)
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
