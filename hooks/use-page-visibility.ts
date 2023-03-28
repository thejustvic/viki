import {useEffect, useState} from 'react'

export const usePageVisibility = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const [isVisible, setVisibility] = useState(!document.hidden)

  useEffect(() => {
    const updatePageVisibility = () => setVisibility(!document.hidden)
    updatePageVisibility()

    document.addEventListener('visibilitychange', updatePageVisibility)
    return () =>
      document.removeEventListener('visibilitychange', updatePageVisibility)
  }, [])

  return isVisible
}
