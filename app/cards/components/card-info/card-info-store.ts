import {FetchQuery} from '@/hooks/use-fetch'
import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import type {User} from '@supabase/supabase-js'
import {makeAutoObservable, observable} from 'mobx'
import {Card} from '../types'

interface State {
  card: SupabaseQuery<Card>
  cardCreator: FetchQuery<User>
}

export class CardInfoStore {
  state: State = {
    card: {
      loading: false,
      data: null,
      error: null
    },
    cardCreator: {
      loading: false,
      data: null,
      error: null
    }
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setCard = (card: State['card']): void => {
    this.state.card = card
  }

  setCardCreator = (cardCreator: State['cardCreator']): void => {
    this.state.cardCreator = cardCreator
  }
}

const [CardInfoStoreContext, useCardInfoStore] = createUseStore<CardInfoStore>()

export {CardInfoStoreContext, useCardInfoStore}
