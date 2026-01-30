import {PropsWithChildren, useState} from 'react'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'

export const EmailLoginProvider = ({children}: PropsWithChildren) => {
  const [store] = useState(() => new EmailLoginStore())

  return (
    <EmailLoginContext.Provider value={store}>
      {children}
    </EmailLoginContext.Provider>
  )
}
