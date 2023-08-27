import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {Card} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {useEmailLoginStore} from './email-login-store'
import {LoginForm} from './login-form'

const TwLoginCard = tw.div`
  w-[300px]
  h-[358px]
  perspective
  preserve-3d
`

const TwLoginCardInner = tw.div<{$rotate: boolean}>`
  relative
  w-full
  h-full
  duration-700
  preserve-3d
  ${p => (p.$rotate ? 'my-rotate-y-180' : '')}
`

const TwCardLogin = tw.div`
  absolute
  w-full
  h-full
  backface-hidden
  preserve-3d
`

const TwCardRegister = tw.div`
  absolute
  w-full
  h-full
  my-rotate-y-180
  backface-hidden
  preserve-3d
`

const TwCard = tw(Card)`
  flex-shrink-0
  w-full
  max-w-sm
  shadow-lg
  bg-base-100
  preserve-3d
`

export const LoginCard = observer(() => {
  const [state] = useEmailLoginStore()

  return (
    <TwLoginCard>
      <TwLoginCardInner $rotate={state.view === 'register'}>
        <TwCardLogin>
          <TwCard>
            <Login />
          </TwCard>
        </TwCardLogin>
        <TwCardRegister>
          <TwCard>
            <Register />
          </TwCard>
        </TwCardRegister>
      </TwLoginCardInner>
    </TwLoginCard>
  )
})

const Login = observer(() => {
  const [, store] = useEmailLoginStore()
  const {supabase} = useSupabase()

  return (
    <LoginForm
      title="Login"
      linkTitle="Don't have an account?"
      handleLink={store.setRegisterView}
      handleAuth={data => supabase.auth.signInWithPassword(data)}
    />
  )
})

const Register = observer(() => {
  const [, store] = useEmailLoginStore()
  const {supabase} = useSupabase()

  return (
    <LoginForm
      title="Register"
      linkTitle="Already have an account?"
      handleLink={store.setLoginView}
      handleAuth={data => supabase.auth.signUp(data)}
    />
  )
})
