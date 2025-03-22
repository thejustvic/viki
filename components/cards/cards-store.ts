import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import type {Card} from './types'

interface State {
  cards: SupabaseQuery<Card[]>
  searchValue: string
}

export class CardsStore {
  state: State = {
    cards: {
      loading: false,
      data: null,
      error: null
    },
    searchValue: ''
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setCards(cards: State['cards']): void {
    this.state.cards = cards
  }

  handleUpdate = (oldCard: Card, newCard: Card): void => {
    const cards = this.state.cards.data?.map(card => {
      if (card.id === oldCard.id) {
        return newCard
      }
      return card
    })
    if (cards) {
      this.setCards({
        ...this.state.cards,
        data: cards
      })
    }
  }

  handleInsert = (newCard: Card): void => {
    if (!this.state.cards.data) {
      return
    }
    this.setCards({
      ...this.state.cards,
      data: [...this.state.cards.data, newCard]
    })
  }

  handleDelete = (oldCard: Card): void => {
    const cards = Util.clone(this.state.cards.data)
    if (cards) {
      this.setCards({
        ...this.state.cards,
        data: cards.filter(message => message.id !== oldCard.id)
      })
    }
  }

  setSearchValue = (value: string): void => {
    this.state.searchValue = value
  }

  searchedCards = (): Card[] => {
    const cards = Util.clone(this.state.cards.data)
    if (!cards) {
      return []
    }
    return cards.filter(card => card.text.includes(this.state.searchValue))
  }
}

const [CardsContext, useCardsStore] = createUseStore<CardsStore>()
export {CardsContext, useCardsStore}
