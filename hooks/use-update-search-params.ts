'use client'

import {usePathname, useSearchParams} from 'next/navigation'

type UpdateSearchParamsFunc = (key: string, value?: string) => void

export const useUpdateSearchParams = (): UpdateSearchParamsFunc => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateSearchParams = (key: string, value?: string): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key) // Removes the key if value is empty
    }
    history.pushState(null, '', `${pathname}?${params.toString()}`)
  }

  return updateSearchParams
}
