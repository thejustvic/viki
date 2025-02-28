'use client'

import {useMemoOne} from '@/hooks/use-memo-one'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'
import {LoginCard} from './login-card'

export const EmailLogin = () => {
  const store = useMemoOne(() => new EmailLoginStore(), [])

  return (
    <EmailLoginContext.Provider value={store}>
      <LoginCard />
    </EmailLoginContext.Provider>
  )
}
