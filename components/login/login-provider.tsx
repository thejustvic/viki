/* eslint-disable max-lines-per-function */
import {Button} from '@/components/daisyui/button'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Turnstile} from '@marsidev/react-turnstile'
import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import {Tabs} from '../daisyui/tabs'

type TabGroup = 'authProviders' | 'anonymously'

// Supabase auth needs to be triggered client-side
export const LoginProviders = observer(() => {
  const [state, store] = useGlobalStore()
  const {supabase} = useSupabase()
  const [captchaToken, setCaptchaToken] = useState<string>()
  const [tabGroup, setTabGroup] = useState<TabGroup>('authProviders')

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
    const {error} = await supabase.auth.signInAnonymously({
      options: {
        captchaToken
      }
    })

    if (!error) {
      window.location.href = '/cards'
    }
  }
  const someLoad = store.checkIfSomeLoad()

  return (
    <Tabs className="w-[310px] justify-around">
      <Tabs.Tab
        value="authProviders"
        onChange={({target: {value}}) => setTabGroup(value as TabGroup)}
        label="Auth Providers"
        groupName="tabGroup"
        checked={tabGroup === 'authProviders'}
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
      <Tabs.Tab
        value="anonymously"
        onChange={({target: {value}}) => setTabGroup(value as TabGroup)}
        label="Anonymously"
        groupName="tabGroup"
        checked={tabGroup === 'anonymously'}
      />
      <Tabs.TabContent className="h-[120px]">
        {tabGroup === 'anonymously' && (
          <>
            <div className="flex gap-2 flex-col">
              <Button
                soft
                color="primary"
                className="join-item"
                onClick={handleAnonymouslyLogin}
                loading={state.logging.anonymously}
                disable={someLoad || !captchaToken}
              >
                Anonymously
              </Button>
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
                onSuccess={token => {
                  setCaptchaToken(token)
                }}
                as="aside"
                options={{
                  theme: state.theme === 'light' ? 'light' : 'dark',
                  size: 'normal'
                }}
              />
            </div>
          </>
        )}
      </Tabs.TabContent>
    </Tabs>
  )
})
