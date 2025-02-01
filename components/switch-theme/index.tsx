'use client'

import {useGlobalStore} from '@/components/global/global-store'
import {Theme} from '@/components/global/types'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconMoon, IconSun} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {Button} from 'react-daisyui'
import {implementTheme} from './utils/implement-theme'
import {updateTheme} from './utils/update-theme'

export const SwitchTheme = observer(() => {
  const {supabase, user} = useSupabase()
  const [state, store] = useGlobalStore()

  useEffect(() => {
    implementTheme(state.theme)
  }, [state.theme])

  const toggleTheme = async () => {
    const theme = await updateTheme({
      theme: state.theme === 'dark' ? 'light' : 'dark',
      opts: {supabase, user}
    })
    store.setTheme(theme)
  }

  if (!user) {
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
