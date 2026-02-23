import {Card} from '@/components/cards/types'
import {FetchQuery} from '@/hooks/use-fetch'
import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import type {User} from '@supabase/supabase-js'
import {makeAutoObservable, observable} from 'mobx'

interface State {
  my: boolean | undefined
  card: SupabaseQuery<Card>
  cardCreator: FetchQuery<User>
}

export class CardInfoStore {
  state: State = {
    my: undefined,
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

  clear = (): void => {
    this.state.card = {
      loading: false,
      data: null,
      error: null
    }
    this.state.cardCreator = {
      loading: false,
      data: null,
      error: null
    }
  }

  setCard = (card: State['card']): void => {
    this.state.card = card
  }

  setMy = (value: boolean): void => {
    this.state.my = value
  }

  setCardCreator = (cardCreator: State['cardCreator']): void => {
    this.state.cardCreator = cardCreator
  }
}

const [CardInfoStoreContext, useCardInfoStore] = createUseStore<CardInfoStore>()

export {CardInfoStoreContext, useCardInfoStore}
