import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Button, ButtonGroup} from 'react-daisyui'

// Supabase auth needs to be triggered client-side
export const ProviderLogin = () => {
  const {supabase} = useSupabase()

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  return (
    <ButtonGroup vertical>
      <Button onClick={handleGitHubLogin}>GitHub</Button>
      <Button onClick={handleGoogleLogin}>Google</Button>
    </ButtonGroup>
  )
}
