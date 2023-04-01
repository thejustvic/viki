import {useEffect, useState} from 'react'

export const usePageVisibility = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const [isVisible, setVisibility] = useState(!document.hidden)

  useEffect(() => {
    const updatePageVisibility = (): void => setVisibility(!document.hidden)
    updatePageVisibility()

    document.addEventListener('visibilitychange', updatePageVisibility)
    return () =>
      document.removeEventListener('visibilitychange', updatePageVisibility)
  }, [])

  return isVisible
}
