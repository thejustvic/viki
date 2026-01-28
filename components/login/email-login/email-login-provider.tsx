import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PropsWithChildren} from 'react'
import {EmailLoginContext, EmailLoginStore} from './email-login-store'

export const EmailLoginProvider = ({children}: PropsWithChildren) => {
  const store = useMemoOne(() => new EmailLoginStore(), [])
  const {user} = useSupabase()

  return (
    <EmailLoginContext.Provider value={store} key={user?.id ?? 'guest'}>
      {children}
    </EmailLoginContext.Provider>
  )
}
