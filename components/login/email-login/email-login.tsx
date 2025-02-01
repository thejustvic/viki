'use client'

import {useEffect, useState} from 'react'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'
import {LoginCard} from './login-card'

export const EmailLogin = () => {
  const [store, setStore] = useState<EmailLoginStore>()
  useEffect(() => {
    setStore(new EmailLoginStore())
  }, [])

  if (!store) {
    return
  }

  return (
    <EmailLoginContext.Provider value={store}>
      <LoginCard />
    </EmailLoginContext.Provider>
  )
}
