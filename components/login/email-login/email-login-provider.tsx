import {PropsWithChildren, useMemo} from 'react'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'

export const EmailLoginProvider = ({children}: PropsWithChildren) => {
  const store = useMemo(() => new EmailLoginStore(), [])

  return (
    <EmailLoginContext.Provider value={store}>
      {children}
    </EmailLoginContext.Provider>
  )
}
