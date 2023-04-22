import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoPersist} from '@/utils/mobx-utils/make-auto-persist'
import {makeAutoObservable, observable} from 'mobx'

interface State {
  view: 'login' | 'register'
}

export class EmailLoginStore {
  state: State = {
    view: 'register'
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    makeAutoPersist(this, 'LoginStore')
  }

  setRegisterView = (): void => {
    this.state.view = 'register'
  }

  setLoginView = (): void => {
    this.state.view = 'login'
  }
}

const [EmailLoginContext, useEmailLoginStore] =
  createUseStore<EmailLoginStore>()
export {EmailLoginContext, useEmailLoginStore}
