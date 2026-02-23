import {reaction, set, toJS} from 'mobx'

interface HasState<S> {
  state: S
}

export const makeAutoPersist = <S>(
  _this: HasState<S>,
  name: string
): (() => void) => {
  if (typeof window === 'undefined' || !window?.localStorage) {
    return () => {}
  }

  try {
    const storedJson = window.localStorage.getItem(name)
    if (storedJson) {
      const parsed = JSON.parse(storedJson) as {state: S}

      if (parsed?.state) {
        set(_this.state as object, parsed.state as object)
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('makeAutoPersist: restore failed', err)
    }
  }

  const disposer = reaction(
    () => toJS(_this.state),
    (state: S) => {
      try {
        window.localStorage.setItem(name, JSON.stringify({state}))
      } catch (err) {
        console.error('makeAutoPersist: save failed', err)
      }
    },
    {delay: 300, fireImmediately: false}
  )

  const handleUnload = () => {
    window.localStorage.setItem(
      name,
      JSON.stringify({state: toJS(_this.state)})
    )
  }
  window.addEventListener('beforeunload', handleUnload)

  return () => {
    disposer()
    window.removeEventListener('beforeunload', handleUnload)
  }
}
