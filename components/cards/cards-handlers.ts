import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import type {Card} from './types'

interface Handlers {
  removeCard: (id: Card['id']) => Promise<void>
  insertCard: (
    text: string,
    teamId: string,
    newPosition: string
  ) => Promise<void>
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

  const removeCard = async (id: Card['id']): Promise<void> => {
    await supabase.from('cards').delete().eq('id', id)
  }

  const insertCard = async (
    text: string,
    teamId: string,
    newPosition: string
  ): Promise<void> => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase.from('cards').insert({
      text,
      author_id: user.id,
      author_email: user.email ?? '',
      team_id: teamId,
      position: newPosition // (e.g. "a00015")
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
