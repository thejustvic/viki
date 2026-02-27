import {useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {CaptchaContext, CaptchaStore} from './captcha-store'

export const CaptchaProvider = ({children}: PropsWithChildren) => {
  const store = useLocalObservable(() => new CaptchaStore())

  return (
    <CaptchaContext.Provider value={store}>{children}</CaptchaContext.Provider>
  )
}
