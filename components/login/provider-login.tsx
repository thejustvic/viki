import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {Button} from '../daisyui/button'
import {useGlobalStore} from '../global/global-store'

// Supabase auth needs to be triggered client-side
export const ProviderLogin = observer(() => {
  const [state, store] = useGlobalStore()
  const {supabase} = useSupabase()

  const handleGitHubLogin = async () => {
    store.setLogging('github')
    await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  }

  const handleGoogleLogin = async () => {
    store.setLogging('google')
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  const handleAnonymouslyLogin = async () => {
    store.setLogging('anonymously')
    await supabase.auth.signInAnonymously()
  }

  return (
    <div className="join join-vertical">
      <Button
        className="join-item"
        onClick={handleAnonymouslyLogin}
        loading={state.logging.anonymously}
      >
        Anonymously
      </Button>
      <Button
        className="join-item"
        onClick={handleGitHubLogin}
        loading={state.logging.github}
      >
        GitHub
      </Button>
      <Button
        className="join-item"
        onClick={handleGoogleLogin}
        loading={state.logging.google}
      >
        Google
      </Button>
    </div>
  )
})
