import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {makeAutoObservable, observable} from 'mobx'
import {makePersistable} from 'mobx-persist-store'

interface State {
  view: 'login' | 'register'
  captchaToken: string
}

const getState = (): State | undefined => {
  const stateString = localStorage.getItem('LoginStore')
  if (stateString) {
    const {state}: {state: State} = JSON.parse(stateString)

    return state
  }
  return undefined
}

const getView = (): State['view'] => {
  const state = getState()
  if (state) {
    return state.view
  }
  return 'register'
}

export class EmailLoginStore {
  state: State = {
    view: getView(),
    captchaToken: ''
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })

    void makePersistable(this, {
      name: 'LoginStore',
      properties: ['state'],
      storage: localStorage
    })
  }

  setRegisterView = (): void => {
    this.state.view = 'register'
  }

  setLoginView = (): void => {
    this.state.view = 'login'
  }

  setCaptchaToken = (token: string): void => {
    this.state.captchaToken = token
  }
}

const [EmailLoginContext, useEmailLoginStore] =
  createUseStore<EmailLoginStore>()
export {EmailLoginContext, useEmailLoginStore}
