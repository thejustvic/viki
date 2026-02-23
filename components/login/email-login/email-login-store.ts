import {AuthView} from '@/components/global-provider/types'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {setCookie} from 'cookies-next'
import {makeAutoObservable, observable} from 'mobx'

interface State {
  view: 'login' | 'register'
}

export class EmailLoginStore {
  state: State = {
    view: 'register'
  }

  constructor(view: AuthView) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    if (view === 'login' || view === 'register') {
      this.state.view = view
    }
  }

  setRegisterView = (): void => {
    this.state.view = 'register'
    void setCookie('auth-view', 'register')
  }

  setLoginView = (): void => {
    this.state.view = 'login'
    void setCookie('auth-view', 'login')
  }
}

const [EmailLoginContext, useEmailLoginStore] =
  createUseStore<EmailLoginStore>()
export {EmailLoginContext, useEmailLoginStore}
