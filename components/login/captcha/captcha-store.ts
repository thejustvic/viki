import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoObservable, observable} from 'mobx'

interface State {
  captchaToken: string | undefined
}

export class CaptchaStore {
  state: State = {
    captchaToken: undefined
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setCaptchaToken = (value: string | undefined): void => {
    this.state.captchaToken = value
  }
}

const [CaptchaContext, useCaptchaStore] = createUseStore<CaptchaStore>()
export {CaptchaContext, useCaptchaStore}
