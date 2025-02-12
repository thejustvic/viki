import {Util} from '@/utils/util'

export const getSearchPost = (): string | null => {
  return Util.getSearchParam('post')
}
