'use client'

import {useWindowSize} from '@/hooks/use-window-size'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Button, ButtonGroup, Hero} from 'react-daisyui'
import tw from 'tailwind-styled-components'

const TwHome = tw.h1`
  text-3xl
  font-bold
`

// Supabase auth needs to be triggered client-side
export const Anonymous = () => {
  const {supabase} = useSupabase()
  const {width = 0} = useWindowSize()

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }
  return (
    <Hero>
      <Hero.Content>
        <ButtonGroup vertical={width < 450}>
          <Button onClick={handleGitHubLogin}>GitHub Login</Button>
          <Button onClick={handleGoogleLogin}>Google Login</Button>
        </ButtonGroup>
        <TwHome>Hello viki!</TwHome>
      </Hero.Content>
    </Hero>
  )
}
