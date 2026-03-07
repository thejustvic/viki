import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {Tabs} from '../daisyui/tabs'
import {AuthTabGroup} from '../global-provider/types'
import {Captcha} from './captcha/captcha'
import {useCaptchaStore} from './captcha/captcha-store'
import {EmailLoginCard} from './email-login/email-login-card'

// Supabase auth needs to be triggered client-side
export const LoginProviders = observer(() => {
  const [, store] = useGlobalStore()

  useEffect(() => {
    store.setLoggingOff()
  }, [])

  return (
    <Tabs className="w-[310px] justify-around">
      <AuthProvidersTab />
      <AnonymouslyTab />
      <EmailTab />
    </Tabs>
  )
})

const AuthProvidersTab = observer(() => {
  const [, captchaStore] = useCaptchaStore()
  const [state, store] = useGlobalStore()
  const {supabase} = useSupabase()

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

  const someLoad = store.checkIfSomeLoad()

  return (
    <>
      <Tabs.Tab
        value="authProviders"
        onChange={({target: {value}}) => {
          store.setAuthTabGroup(value as AuthTabGroup)
          captchaStore.setCaptchaToken(undefined)
        }}
        label="Auth Providers"
        groupName="tabGroup"
        checked={state.authTabGroup === 'authProviders'}
      />
      <Tabs.TabContent className="h-[120px]">
        <div className="join join-vertical w-full">
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
      </Tabs.TabContent>
    </>
  )
})

const AnonymouslyTab = observer(() => {
  const [captchaState, captchaStore] = useCaptchaStore()
  const [state, store] = useGlobalStore()
  const {supabase} = useSupabase()
  const someLoad = store.checkIfSomeLoad()

  const handleAnonymouslyLogin = async () => {
    store.setLogging('anonymously')
    const {error} = await supabase.auth.signInAnonymously({
      options: {
        captchaToken: captchaState.captchaToken
      }
    })

    if (!error) {
      window.location.href = '/cards'
    }
  }

  return (
    <>
      <Tabs.Tab
        value="anonymously"
        onChange={({target: {value}}) => {
          store.setAuthTabGroup(value as AuthTabGroup)
          captchaStore.setCaptchaToken(undefined)
        }}
        label="Anonymously"
        groupName="tabGroup"
        checked={state.authTabGroup === 'anonymously'}
      />
      <Tabs.TabContent className="h-[120px]">
        {state.authTabGroup === 'anonymously' && (
          <>
            <div className="flex gap-2 flex-col">
              <Button
                soft
                color="primary"
                className="join-item"
                onClick={handleAnonymouslyLogin}
                loading={state.logging.anonymously}
                disable={someLoad || !captchaState.captchaToken}
              >
                Enter Anonymously
              </Button>
              <Captcha />
            </div>
          </>
        )}
      </Tabs.TabContent>
    </>
  )
})

const EmailTab = observer(() => {
  const [, captchaStore] = useCaptchaStore()
  const [state, store] = useGlobalStore()

  return (
    <>
      <Tabs.Tab
        value="email"
        onChange={({target: {value}}) => {
          store.setAuthTabGroup(value as AuthTabGroup)
          captchaStore.setCaptchaToken(undefined)
        }}
        label="Email"
        groupName="tabGroup"
        checked={state.authTabGroup === 'email'}
      />
      <Tabs.TabContent>
        {state.authTabGroup === 'email' && (
          <>
            <EmailLoginCard />
            <Captcha />
          </>
        )}
      </Tabs.TabContent>
    </>
  )
})
