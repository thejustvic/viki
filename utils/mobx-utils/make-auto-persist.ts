import {reaction, set, toJS} from 'mobx'

export const makeAutoPersist = <T extends {state: any}>(
  _this: T,
  name: string
): (() => void) => {
  if (typeof window === 'undefined' || !window?.localStorage) {
    return () => {}
  }

  try {
    const storedJson = window.localStorage.getItem(name)
    if (storedJson) {
      const parsed = JSON.parse(storedJson)

      if (parsed?.state) {
        set(_this.state, parsed.state)
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('makeAutoPersist: restore failed', err)
    }
  }

  const disposer = reaction(
    () => toJS(_this.state),
    state => {
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
