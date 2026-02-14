import {useEffect} from 'react'

export const useSetFocusAfterTransitionEnd = (
  data: {
    id: string
    dep: string | null
  },
  focusHandler: () => void,
  callbackHandler: () => void
): void => {
  const {id, dep} = data
  useEffect(() => {
    const element = document.getElementById(id)
    if (!element) {
      return
    }

    const handleTransitionend = (e: TransitionEvent): void => {
      if (dep) {
        if (e?.propertyName === 'opacity') {
          focusHandler()
        }
      } else {
        callbackHandler()
      }
    }

    element?.addEventListener('transitionend', handleTransitionend)

    return () => {
      element?.removeEventListener('transitionend', handleTransitionend)
    }
  }, [dep])
}
