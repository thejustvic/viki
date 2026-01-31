import {useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'

export default function EmailLoginProvider({children}: PropsWithChildren) {
  const store = useLocalObservable(() => new EmailLoginStore())

  return (
    <EmailLoginContext.Provider value={store}>
      {children}
    </EmailLoginContext.Provider>
  )
}
