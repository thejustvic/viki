import {AuthResponse} from '@supabase/supabase-js'
import {Button, Card, Form, Input, Link} from 'react-daisyui'
import {SubmitHandler, useForm} from 'react-hook-form'
import tw from 'tailwind-styled-components'

const TwTitle = tw(Card.Title)`
  flex 
  justify-center 
  pt-4
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

export const LoginForm = ({
  handleLink,
  handleAuth,
  title,
  linkTitle
}: LoginFormProps) => {
  const {
    register,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async data => {
    const {error} = await handleAuth(data)
    if (error) {
      setError(
        'email',
        {type: 'focus', message: error.message},
        {shouldFocus: true}
      )
    }
  }

  return (
    <>
      <TwTitle>{title}</TwTitle>
      <TwBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Label title="Email" />
          <Input
            type="text"
            placeholder="email"
            {...register('email', {
              required: true,
              pattern: /^\S+@\S+$/i
            })}
          />
          <Form.Label title="Password" />
          <Input
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
          <TwSubmit type="submit">Submit</TwSubmit>
          {errors.email?.message && errors.email?.message?.length > 0 && (
            <TwError>{errors.email.message}</TwError>
          )}
          {errors.password?.message && errors.password?.message?.length > 0 && (
            <TwError>{errors.password.message}</TwError>
          )}
        </Form>
        <TwLink onClick={handleLink}>{linkTitle}</TwLink>
      </TwBody>
    </>
  )
}
