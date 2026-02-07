import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import Tilt from 'react-parallax-tilt'
import tw from 'tailwind-styled-components'
import {EmailLoginForm} from './email-login-form'
import {useEmailLoginStore} from './email-login-store'

const TwLoginCardInner = tw.div<{$rotate: boolean}>` 
  w-[300px]
  h-[360px] 
  duration-700
  bg-base-100
  perspective-distant
  transform-3d
  ${p => (p.$rotate ? 'rotate-y-180' : 'rotate-y-0')}
`

const TwCardSide = tw.div`
  absolute 
  w-full 
  h-full
  backface-hidden
  transform-3d
`

const TwCardLogin = tw(TwCardSide)`rotate-y-0`

const TwCardRegister = tw(TwCardSide)`rotate-y-180`

const TwCard = tw.div`
  w-full
  h-full
  flex-shrink-0
  max-w-sm
  shadow-lg
  bg-base-100
  transform-3d
`

export const EmailLoginCard = observer(() => {
  const [state] = useEmailLoginStore()
  const isLogin = state.view === 'login'

  useFlipCard()

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
  const [, store] = useEmailLoginStore()
  const {supabase} = useSupabase()

  return (
    <EmailLoginForm
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

const useFlipCard = () => {
  const [state, store] = useEmailLoginStore()

  useEffect(() => {
    let timer1, timer2
    const timer_1_time = 1500
    const timer_2_time = 3000
    if (state.view === 'login') {
      timer1 = setTimeout(store.setRegisterView, timer_1_time)
      timer2 = setTimeout(store.setLoginView, timer_2_time)
    } else {
      timer1 = setTimeout(store.setLoginView, timer_1_time)
      timer2 = setTimeout(store.setRegisterView, timer_2_time)
    }
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])
}
