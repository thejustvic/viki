import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PostgrestSingleResponse} from '@supabase/postgrest-js'
import {generateKeyBetween} from 'fractional-indexing'
import {useTeamStore} from '../team/team-store'
import {useCardsStore} from './cards-store'
import type {Card} from './types'

interface Handlers {
  removeCard: (id: Card['id']) => Promise<void>
  insertCard: (text: string) => Promise<PostgrestSingleResponse<Card>>
  updateCard: (text: string, cardId: string) => Promise<void>
  updateCardPosition: (position: string, cardId: string) => Promise<void>
  updateCardVisual: (visual: string, cardId: string) => Promise<void>
  updateCardBgImage: (bgImage: string, cardId: string) => Promise<void>
  updateColor: (
    cardId: string,
    name: keyof Card,
    color: string
  ) => Promise<void>
}

export const useCardHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()
  const [cardsStore] = useCardsStore()
  const [state] = useTeamStore()

  const removeCard = async (id: Card['id']): Promise<void> => {
    await supabase.from('cards').delete().eq('id', id)
  }

  const insertCard = async (
    text: string
  ): Promise<PostgrestSingleResponse<Card>> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    if (!state.currentTeamId) {
      throw Error('You must provide a current team id!')
    }
    const cards = cardsStore.cards.data
    const lastPosition = cards?.[cards.length - 1]?.position ?? null
    const newPosition = generateKeyBetween(lastPosition, null)

    const data = await supabase
      .from('cards')
      .insert({
        text,
        author_id: user.id,
        author_email: user.email ?? '',
        team_id: state.currentTeamId,
        position: newPosition // (e.g. "a00015")
      })
      .select()
      .single()
    return data
  }

  const updateCard = async (text: string, cardId: string): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        text
      })
      .eq('id', cardId)
  }

  const updateCardPosition = async (
    position: string,
    cardId: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        position
      })
      .eq('id', cardId)
  }

  const updateCardVisual = async (
    visual: string,
    cardId: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        selected_visual: visual
      })
      .eq('id', cardId)
  }

  const updateCardBgImage = async (
    bgImage: string,
    cardId: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        bg_image: bgImage
      })
      .eq('id', cardId)
  }

  const updateColor = async (
    cardId: string,
    name: keyof Card,
    color: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }

    await supabase
      .from('cards')
      .update({
        [name]: color
      })
      .eq('id', cardId)
  }

  return {
    removeCard,
    insertCard,
    updateCard,
    updateCardPosition,
    updateCardVisual,
    updateCardBgImage,
    updateColor
  }
}
