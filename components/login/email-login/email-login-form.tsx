import {Button} from '@/components/daisyui/button'
import {Card} from '@/components/daisyui/card'
import {Form} from '@/components/daisyui/form'
import {Input} from '@/components/daisyui/input'
import {Link} from '@/components/daisyui/link'
import {useGlobalStore} from '@/components/global/global-store'
import {AuthResponse} from '@supabase/supabase-js'
import {observer} from 'mobx-react-lite'
import {CSSProperties} from 'react'
import {SubmitHandler, useForm, UseFormRegister} from 'react-hook-form'
import tw from 'tailwind-styled-components'

const TwTitle = tw(Card.Title)`
  flex 
  justify-center 
  py-4
`

const TwBody = tw(Card.Body)`
  pt-0 
  pb-4
  justify-between
  backface-hidden
`

const TwSubmit = tw(Button)`
  mt-1
`

const TwError = tw.p`
  w-full 
  text-xs 
  text-center 
  text-error
  backface-hidden
`

const TwLink = tw(Link)`
  flex 
  justify-center
`
const TwErrorWrapper = tw.div`
  p-2
  bg-info-content
  rounded-xl
`

interface LoginFormProps {
  isRegister?: boolean
  title: 'Login' | 'Register'
  linkTitle: 'Already have an account?' | "Don't have an account?"
  handleLink: () => void
  handleAuth: (data: FormValues) => Promise<AuthResponse>
}

interface FormValues {
  name?: string
  email: string
  password: string
}

const transform: CSSProperties = {
  transform: 'translateZ(20px)'
}

export const EmailLoginForm = observer(
  ({
    isRegister = false,
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

    const [state, store] = useGlobalStore()
    const onSubmit: SubmitHandler<FormValues> = async data => {
      store.setLogging('email')
      const {
        data: {user},
        error
      } = await handleAuth(data)
      if (user) {
        store.setLoggingOff()
      }
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
            <Inputs register={register} isRegister={isRegister} />
            <TwSubmit type="submit" loading={state.logging.email}>
              Submit
            </TwSubmit>
          </Form>
          <TwLink onClick={handleLink}>{linkTitle}</TwLink>
          {errors.email?.message && errors.email?.message?.length > 0 && (
            <TwErrorWrapper>
              <TwError>{errors.email.message}</TwError>
            </TwErrorWrapper>
          )}
        </TwBody>
      </>
    )
  }
)

const Inputs = ({
  isRegister,
  register
}: {
  isRegister: boolean
  register: UseFormRegister<FormValues>
}) => {
  return (
    <>
      {isRegister && (
        <Input
          label="Name"
          type="text"
          placeholder="name"
          {...register('name', {
            required: true
          })}
        />
      )}
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
    </>
  )
}
