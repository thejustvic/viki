'use client'

import {useGlobalStore} from '@/common/global/global-store'
import {Theme} from '@/common/global/types'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconMoon, IconSun} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {Button} from 'react-daisyui'
import {implementTheme} from './utils/implement-theme'
import {updateTheme} from './utils/update-theme'

export const SwitchTheme = observer(() => {
  const {supabase, session} = useSupabase()
  const [state, store] = useGlobalStore()

  const toggleTheme = async () => {
    const theme = await updateTheme({
      theme: state.theme === 'dark' ? 'light' : 'dark',
      opts: {supabase, session}
    })
    implementTheme(store, theme)
  }

  if (!session) {
    return null
  }

  return (
    <Button
      color="ghost"
      shape="circle"
      onClick={toggleTheme}
      loading={!state.theme}
    >
      {getTheme(state.theme)}
    </Button>
  )
})

const getTheme = (theme: Theme) => {
  switch (theme) {
    case 'dark':
      return <IconMoon />
    case 'light':
      return <IconSun />
    default:
      throw new Error(`unsupported theme: ${theme}`)
  }
}
