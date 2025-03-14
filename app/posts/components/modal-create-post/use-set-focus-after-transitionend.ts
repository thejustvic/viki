import {useEffect} from 'react'

export const useSetFocusAfterTransitionEnd = (
  id: string,
  dep: string | null,
  focusHandler: () => void,
  callbackHandler: () => void
) => {
  useEffect(() => {
    if (dep) {
      document.getElementById(id)?.addEventListener('transitionend', e => {
        if (e.propertyName === 'opacity') {
          focusHandler()
        }
      })
    } else {
      callbackHandler()
    }
  }, [dep])
}
