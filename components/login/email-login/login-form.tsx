import {Button} from '@/components/daisyui/button'
import {Card} from '@/components/daisyui/card'
import {Form} from '@/components/daisyui/form'
import {Input} from '@/components/daisyui/input'
import {Link} from '@/components/daisyui/link'
import {useGlobalStore} from '@/components/global/global-store'
import {AuthResponse} from '@supabase/supabase-js'
import {observer} from 'mobx-react-lite'
import {CSSProperties} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import tw from 'tailwind-styled-components'

const TwTitle = tw(Card.Title)`
  flex 
  justify-center 
  py-4
`

const TwBody = tw(Card.Body)`
  pt-0 
  pb-4
`

const TwSubmit = tw(Button)`
  mt-6
`

const TwError = tw.p`
  w-full 
  mt-2 
  text-xs 
  text-center 
  text-error
`

const TwLink = tw(Link)`
  flex 
  justify-center
`

interface LoginFormProps {
  title: 'Login' | 'Register'
  linkTitle: 'Already have an account?' | "Don't have an account?"
  handleLink: () => void
  handleAuth: (data: FormValues) => Promise<AuthResponse>
}

interface FormValues {
  email: string
  password: string
}

const transform: CSSProperties = {
  transform: 'translateZ(20px)'
}

export const LoginForm = observer(
  ({handleLink, handleAuth, title, linkTitle}: LoginFormProps) => {
    const {
      register,
      setError,
      handleSubmit,
      formState: {errors}
    } = useForm<FormValues>()
    const [state, store] = useGlobalStore()
    const onSubmit: SubmitHandler<FormValues> = async data => {
      store.setLogging('email')
      const {error} = await handleAuth(data)
      if (error) {
        store.setLoggingOff()
        setError(
          'email',
          {type: 'focus', message: error.message},
          {shouldFocus: true}
        )
      }
    }

    return (
      <>
        <TwTitle style={transform}>{title}</TwTitle>
        <TwBody style={transform}>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <Input
              label="Email"
              type="text"
              placeholder="email"
              {...register('email', {
                required: true,
                pattern: /^\S+@\S+$/i
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="password"
              {...register('password', {
                required: true,
                minLength: {
                  value: 6,
                  message: 'Password should be at least 6 characters'
                }
              })}
            />
            <TwSubmit type="submit" loading={state.logging.email}>
              Submit
            </TwSubmit>
            {errors.email?.message && errors.email?.message?.length > 0 && (
              <TwError>{errors.email.message}</TwError>
            )}
            {errors.password?.message &&
              errors.password?.message?.length > 0 && (
                <TwError>{errors.password.message}</TwError>
              )}
          </Form>
          <TwLink onClick={handleLink}>{linkTitle}</TwLink>
        </TwBody>
      </>
    )
  }
)
