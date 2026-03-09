import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import type {TurnstileInstance} from '@marsidev/react-turnstile'
import {makeAutoObservable, observable} from 'mobx'

interface State {
  captchaToken: string | undefined
  turnstileInstance: TurnstileInstance | null
  isLoaded: boolean
}

export class CaptchaStore {
  state: State = {
    captchaToken: undefined,
    turnstileInstance: null,
    isLoaded: false
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.deep
    })
  }

  setIsLoaded = (value: boolean) => {
    this.state.isLoaded = value
  }

  setCaptchaToken = (value: string | undefined): void => {
    this.state.captchaToken = value
  }

  setTurnstileInstance = (instance: TurnstileInstance | null) => {
    this.state.turnstileInstance = instance
  }

  resetCaptcha = () => {
    if (this.state.isLoaded && this.state.turnstileInstance) {
      try {
        this.state.turnstileInstance.reset()
      } catch (e) {
        console.warn('Turnstile reset failed:', e)
      }
    }
  }
}

const [CaptchaContext, useCaptchaStore] = createUseStore<CaptchaStore>()
export {CaptchaContext, useCaptchaStore}
