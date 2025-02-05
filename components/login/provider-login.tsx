import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Button} from '../daisyui/button'

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
    <div className="join join-vertical">
      <Button className="join-item" onClick={handleGitHubLogin}>
        GitHub
      </Button>
      <Button className="join-item" onClick={handleGoogleLogin}>
        Google
      </Button>
    </div>
  )
}
