import {removeHash} from '@/utils/next-utils/remove-hash'
import {useEffect} from 'react'

export const useRemoveHash = () => {
  useEffect(() => {
    removeHash()
  }, [])
}
