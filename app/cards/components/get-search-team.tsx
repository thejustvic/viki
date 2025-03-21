import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'

export const getSearchTeam = (): string | null => {
  return getSearchParam('team')
}
