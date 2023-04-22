import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {Button, Card, Form, Input, Link} from 'react-daisyui'
import {SubmitHandler, useForm} from 'react-hook-form'
import {
  EmailLoginContext,
  EmailLoginStore,
  useEmailLoginStore
} from './email-login-store'

export const EmailLogin = () => {
  const store = useMemoOne(() => new EmailLoginStore(), [])

  return (
    <EmailLoginContext.Provider value={store}>
      <LoginCard />
    </EmailLoginContext.Provider>
  )
}

interface FormValues {
  email: string
  password: string
}

const Login = observer(() => {
  const [, store] = useEmailLoginStore()
  const {supabase} = useSupabase()
  const {register, handleSubmit} = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async data => {
    await supabase.auth.signInWithPassword(data)
  }

  return (
    <>
      <Card.Title className="flex justify-center pt-4">Login</Card.Title>
      <Card.Body className="pt-0 pb-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Label title="Email" />
          <Input
            type="text"
            placeholder="email"
            className="input-bordered"
            {...register('email', {
              required: true,
              pattern: /^\S+@\S+$/i
            })}
          />
          <Form.Label title="Password" />
          <Input
            type="password"
            placeholder="password"
            className="input-bordered"
            {...register('password', {required: true, min: 4})}
          />
          <Button type="submit" className="mt-8">
            Submit
          </Button>
        </Form>
        <Link
          className="flex justify-center"
          onClick={() => store.setRegisterView()}
        >
          Don't have an account?
        </Link>
      </Card.Body>
    </>
  )
})

const Register = observer(() => {
  const [, store] = useEmailLoginStore()
  const {supabase} = useSupabase()
  const {register, handleSubmit} = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async data => {
    await supabase.auth.signUp(data)
  }

  return (
    <>
      <Card.Title className="flex justify-center pt-4">Register</Card.Title>
      <Card.Body className="pt-0 pb-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Label title="Email" />
          <Input
            type="text"
            placeholder="email"
            className="input-bordered"
            {...register('email', {
              required: true,
              pattern: /^\S+@\S+$/i
            })}
          />
          <Form.Label title="Password" />
          <Input
            type="password"
            placeholder="password"
            className="input-bordered"
            {...register('password', {required: true, min: 4})}
          />

          <Button type="submit" className="mt-8">
            Submit
          </Button>
        </Form>
        <Link
          className="flex justify-center"
          onClick={() => store.setLoginView()}
        >
          Already have an account?
        </Link>
      </Card.Body>
    </>
  )
})

const LoginCard = observer(() => {
  const [state] = useEmailLoginStore()

  return (
    <div className="w-[300px] h-[358px] perspective">
      <div
        className={`relative w-full h-full duration-700 preserve-3d ${
          state.view === 'register' && 'my-rotate-y-180'
        }`}
      >
        <div className="absolute w-full h-full backface-hidden">
          <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <Login />
          </Card>
        </div>
        <div className="absolute w-full h-full my-rotate-y-180 backface-hidden">
          <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <Register />
          </Card>
        </div>
      </div>
    </div>
  )
})
