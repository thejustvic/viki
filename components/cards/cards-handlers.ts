import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import type {Card} from './types'

interface Handlers {
  removeCard: (id: Card['id']) => Promise<void>
  insertCard: (text: string, teamId: string) => Promise<void>
  updateCard: (text: string, cardId: string) => Promise<void>
  updateCardBgImage: (bgImage: string, cardId: string) => Promise<void>
  updateCardBaubleColorCompleted: (
    color: string,
    cardId: string
  ) => Promise<void>
  updateCardBaubleColorNotCompleted: (
    color: string,
    cardId: string
  ) => Promise<void>
  updateCardBaubleTextColorCompleted: (
    color: string,
    cardId: string
  ) => Promise<void>
  updateCardBaubleTextColorNotCompleted: (
    color: string,
    cardId: string
  ) => Promise<void>
}

export const useCardHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

  const removeCard = async (id: Card['id']): Promise<void> => {
    await supabase.from('cards').delete().eq('id', id)
  }

  const insertCard = async (text: string, teamId: string): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase.from('cards').insert({
      text,
      author_id: user.id,
      author_email: user.email || '',
      team_id: teamId
    })
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

  const updateCardBaubleColorCompleted = async (
    color: string,
    cardId: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        bauble_color_completed: color
      })
      .eq('id', cardId)
  }

  const updateCardBaubleColorNotCompleted = async (
    color: string,
    cardId: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        bauble_color_not_completed: color
      })
      .eq('id', cardId)
  }

  const updateCardBaubleTextColorCompleted = async (
    color: string,
    cardId: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        bauble_text_color_completed: color
      })
      .eq('id', cardId)
  }

  const updateCardBaubleTextColorNotCompleted = async (
    color: string,
    cardId: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('cards')
      .update({
        bauble_text_color_not_completed: color
      })
      .eq('id', cardId)
  }

  return {
    removeCard,
    insertCard,
    updateCard,
    updateCardBgImage,
    updateCardBaubleColorCompleted,
    updateCardBaubleColorNotCompleted,
    updateCardBaubleTextColorCompleted,
    updateCardBaubleTextColorNotCompleted
  }
}
