import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'

// Supabase auth needs to be triggered client-side
export const LoginProviders = observer(() => {
  const [state, store] = useGlobalStore()
  const {supabase} = useSupabase()

  useEffect(() => {
    store.setLoggingOff()
  }, [])
  const handleGitHubLogin = async () => {
    store.setLogging('github')
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }
  const handleGoogleLogin = async () => {
    store.setLogging('google')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }
  const handleAnonymouslyLogin = async () => {
    store.setLogging('anonymously')
    const {error} = await supabase.auth.signInAnonymously()

    if (!error) {
      window.location.href = '/cards'
    }
  }
  const someLoad = store.checkIfSomeLoad()

  return (
    <div className="join join-vertical">
      <Button
        soft
        color="primary"
        className="join-item"
        onClick={handleAnonymouslyLogin}
        loading={state.logging.anonymously}
        disable={someLoad}
      >
        Anonymously
      </Button>
      <Button
        soft
        color="primary"
        className="join-item"
        onClick={handleGitHubLogin}
        loading={state.logging.github}
        disable={someLoad}
      >
        GitHub
      </Button>
      <Button
        soft
        color="primary"
        className="join-item"
        onClick={handleGoogleLogin}
        loading={state.logging.google}
        disable={someLoad}
      >
        Google
      </Button>
    </div>
  )
})
