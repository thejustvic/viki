import {AuthView} from '@/components/global-provider/types'
import {useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'

interface Props extends PropsWithChildren {
  cookieAuthView: AuthView
}

export default function EmailLoginProvider({children, cookieAuthView}: Props) {
  const store = useLocalObservable(() => new EmailLoginStore(cookieAuthView))

  return (
    <EmailLoginContext.Provider value={store}>
      {children}
    </EmailLoginContext.Provider>
  )
}
