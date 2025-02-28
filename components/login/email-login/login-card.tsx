import {Card} from '@/components/daisyui/card'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'
import {useEmailLoginStore} from './email-login-store'
import {LoginForm} from './login-form'

const TwLoginCard = tw.div`
  w-[300px]
  h-[320px]
  perspective-distant
  transform-3d
`

const TwLoginCardInner = tw.div<{$rotate: boolean}>`
  relative
  w-full
  h-full
  duration-700
  transform-3d
  ${p => (p.$rotate ? 'rotate-y-180' : '')}
`

const TwCardLogin = tw.div`
  absolute
  w-full
  h-full
  backface-hidden
  transform-3d
`

const TwCardRegister = tw.div`
  absolute
  w-full
  h-full
  rotate-y-180
  backface-hidden
  transform-3d
`

const TwCard = tw(Card)`
  flex-shrink-0
  w-full
  max-w-sm
  shadow-lg
  bg-base-100
  transform-3d
  h-full
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
