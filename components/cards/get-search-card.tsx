import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'

export const getSearchCard = (): string | null => {
  return getSearchParam('card')
}
