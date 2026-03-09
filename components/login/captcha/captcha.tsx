import {useGlobalStore} from '@/components/global-provider/global-store'
import {Turnstile, type TurnstileInstance} from '@marsidev/react-turnstile'
import {observer} from 'mobx-react-lite'
import {useEffect, useRef} from 'react'
import {useCaptchaStore} from './captcha-store'

export const Captcha = observer(() => {
  const ref = useRef<TurnstileInstance>(null)
  const [globalState] = useGlobalStore()
  const [, store] = useCaptchaStore()

  useEffect(() => {
    return () => store.setTurnstileInstance(null)
  }, [store])

  return (
    <Turnstile
      ref={ref}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
      onWidgetLoad={() => {
        store.setTurnstileInstance(ref.current)
        store.setIsLoaded(true)
      }}
      onExpire={() => {
        store.setCaptchaToken(undefined)
        store.resetCaptcha()
      }}
      onSuccess={token => {
        store.setCaptchaToken(token)
      }}
      onError={data => {
        console.error('turnstile load error: ', data)
        store.setTurnstileInstance(null)
      }}
      as="aside"
      options={{
        theme: globalState.theme === 'light' ? 'light' : 'dark',
        size: 'normal'
      }}
    />
  )
})
