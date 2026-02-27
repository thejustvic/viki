import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import Tilt from 'react-parallax-tilt'
import tw from 'tailwind-styled-components'
import {useCaptchaStore} from '../captcha/captcha-store'
import {EmailLoginForm} from './email-login-form'
import {useEmailLoginStore} from './email-login-store'

const TwLoginCardInner = tw.div<{$rotate: boolean}>` 
  rounded-md
  w-[300px]
  duration-700
  bg-base-100
  perspective-distant
  transform-3d
  ${p => (p.$rotate ? 'rotate-y-180' : 'rotate-y-0')}
`

const TwCardSide = tw.div`
  backface-hidden
  transform-3d
`

const TwCardLogin = tw(TwCardSide)`rotate-y-0`

const TwCardRegister = tw(TwCardSide)`rotate-y-180`

const TwCard = tw.div`
  shrink-0
  max-w-sm
  bg-base-100
  transform-3d
  rounded-md
`

export const EmailLoginCard = observer(() => {
  const [state] = useEmailLoginStore()
  const isLogin = state.view === 'login'

  return (
    <Tilt
      tiltMaxAngleX={0}
      tiltMaxAngleY={0}
      perspective={1000}
      transitionSpeed={700}
      style={{transformStyle: 'preserve-3d'}}
    >
      <TwLoginCardInner $rotate={!isLogin}>
        {isLogin ? (
          <>
            <TwCardLogin>
              <TwCard>
                <Login />
              </TwCard>
            </TwCardLogin>
          </>
        ) : (
          <>
            <TwCardRegister>
              <TwCard>
                <Register />
              </TwCard>
            </TwCardRegister>
          </>
        )}
      </TwLoginCardInner>
    </Tilt>
  )
})

const Login = observer(() => {
  const [captchaState] = useCaptchaStore()
  const [, store] = useEmailLoginStore()
  const {supabase} = useSupabase()

  return (
    <EmailLoginForm
      title="Login"
      linkTitle="Don't have an account?"
      handleLink={store.setRegisterView}
      handleAuth={data =>
        supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
          options: {
            captchaToken: captchaState.captchaToken
          }
        })
      }
    />
  )
})

const Register = observer(() => {
  const [captchaState] = useCaptchaStore()
  const [, store] = useEmailLoginStore()
  const {supabase} = useSupabase()

  return (
    <EmailLoginForm
      isRegister
      title="Register"
      linkTitle="Already have an account?"
      handleLink={store.setLoginView}
      handleAuth={data =>
        supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            captchaToken: captchaState.captchaToken,
            data: {
              full_name: data.name,
              email: data.email
            }
          }
        })
      }
    />
  )
})
