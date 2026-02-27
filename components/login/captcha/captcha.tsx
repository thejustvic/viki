import {useGlobalStore} from '@/components/global-provider/global-store'
import {Turnstile} from '@marsidev/react-turnstile'
import {observer} from 'mobx-react-lite'
import {useCaptchaStore} from './captcha-store'

export const Captcha = observer(() => {
  const [globalState] = useGlobalStore()
  const [, store] = useCaptchaStore()
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
      onSuccess={token => {
        store.setCaptchaToken(token)
      }}
      as="aside"
      options={{
        theme: globalState.theme === 'light' ? 'light' : 'dark',
        size: 'normal'
      }}
    />
  )
})
