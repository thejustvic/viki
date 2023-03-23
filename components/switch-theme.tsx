'use client'

import {useGlobalStore} from '@/common/global/global-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {setCookie} from 'cookies-next'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {Button} from 'react-daisyui'

export const SwitchTheme = observer(() => {
  const {supabase, session} = useSupabase()
  const [state, store] = useGlobalStore()

  const updateTheme = (themeRes: string) => {
    store.updateTheme(themeRes)
    document.body.setAttribute('data-theme', themeRes)
    setCookie('theme', themeRes)
  }

  useEffect(() => {
    const fetch = async () => {
      const {data} = await supabase
        .from('users')
        .select('theme')
        .eq('id', session?.user.id)

      const themeRes = data?.[0].theme || 'dark'
      updateTheme(themeRes)
    }
    session && fetch()
  }, [session])

  const toggleTheme = async () => {
    const theme = state.theme === 'dark' ? 'garden' : 'dark'
    const {data} = await supabase
      .from('users')
      .update({theme})
      .eq('id', session?.user.id)
      .select()

    const themeRes = data?.[0]?.theme || 'dark'
    updateTheme(themeRes)
  }

  if (!session) {
    return null
  }

  return (
    <Button color="ghost" onClick={toggleTheme}>
      {state.theme}
    </Button>
  )
})
