import {useMemoOne} from '@/hooks/use-memo-one'
import {PropsWithChildren} from 'react'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'

export const EmailLoginProvider = ({children}: PropsWithChildren) => {
  const store = useMemoOne(() => new EmailLoginStore(), [])

  return (
    <EmailLoginContext.Provider value={store}>
      {children}
    </EmailLoginContext.Provider>
  )
}
