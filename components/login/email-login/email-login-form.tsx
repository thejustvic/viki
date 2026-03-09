import {Button} from '@/components/daisyui/button'
import {Card} from '@/components/daisyui/card'
import {Form} from '@/components/daisyui/form'
import {Input} from '@/components/daisyui/input'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {BooleanHookState, useBoolean} from '@/hooks/use-boolean'
import {AuthResponse} from '@supabase/supabase-js'
import {observer} from 'mobx-react-lite'
import {SubmitHandler, useForm, UseFormRegister} from 'react-hook-form'
import tw from 'tailwind-styled-components'
import {useCaptchaStore} from '../captcha/captcha-store'

const TwTitle = tw(Card.Title)`
  flex 
  justify-center 
  py-4
`

const TwBody = tw(Card.Body)`
  pt-0 
`

const TwSubmit = tw(Button)`
  mt-1
`

const TwError = tw.p`
  w-full 
  text-xs 
  text-center 
  text-error
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
    const cloudflareNeedToReset = useBoolean(false)
    const [, captchaStore] = useCaptchaStore()
    const [, store] = useGlobalStore()

    const onSubmit: SubmitHandler<FormValues> = async data => {
      store.setLogging('email')
      const {
        data: {session},
        error
      } = await handleAuth(data)
      if (session) {
        captchaStore.setCaptchaToken(undefined)
        store.setLoggingOff()
      }
      if (error) {
        cloudflareNeedToReset.turnOn()
        captchaStore.setCaptchaToken(undefined)
        store.setLoggingOff()
        setError(
          'email',
          {type: 'focus', message: error.message},
          {shouldFocus: true}
        )
      }
    }

    return (
      <div className={'transform-3d backface-hidden'}>
        <TwTitle>{title}</TwTitle>
        <TwBody>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className={'flex flex-col gap-8'}
          >
            <Inputs register={register} isRegister={isRegister} />
            <Buttons cloudflareNeedToReset={cloudflareNeedToReset} />
            {errors.email?.message && errors.email?.message?.length > 0 && (
              <TwErrorWrapper>
                <TwError>{errors.email.message}</TwError>
              </TwErrorWrapper>
            )}
          </Form>
          <Button ghost variant="link" size="sm" onClick={handleLink}>
            {linkTitle}
          </Button>
        </TwBody>
      </div>
    )
  }
)

const Buttons = observer(
  ({cloudflareNeedToReset}: {cloudflareNeedToReset: BooleanHookState}) => {
    const [captchaState, captchaStore] = useCaptchaStore()
    const [state, store] = useGlobalStore()

    const isSubmitDisable =
      store.checkIfSomeLoad() || !captchaState.captchaToken

    return (
      <div className="join join-vertical">
        <TwSubmit
          soft
          color="primary"
          type="submit"
          loading={state.logging.email}
          disable={isSubmitDisable}
          className="join-item"
        >
          Submit
        </TwSubmit>
        {cloudflareNeedToReset.value && (
          <Button
            type="button"
            soft
            className="join-item"
            onClick={captchaStore.resetCaptcha}
          >
            push to reset cloudflare
          </Button>
        )}
      </div>
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
