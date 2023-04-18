import {useEffect, useState} from 'react'

export const useDebouncedValue = <T>(value: T, delayMs: number): T | '' => {
  const [debouncedValue, setDebouncedValue] = useState<T | ''>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => {
      clearTimeout(timeout)
      setDebouncedValue('')
    }
  }, [value, delayMs])

  return debouncedValue
}
