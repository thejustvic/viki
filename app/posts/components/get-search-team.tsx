import {Util} from '@/utils/util'

export const getSearchTeam = (): string | null => {
  return Util.getSearchParam('team')
}
