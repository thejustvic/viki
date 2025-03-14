import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'

export const getSearchPost = (): string | null => {
  return getSearchParam('post')
}
