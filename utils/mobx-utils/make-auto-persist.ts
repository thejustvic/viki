import {ArrUtil} from '@/utils/arr-util'
import {ObjUtil} from '@/utils/obj-util'
import {IReactionDisposer, reaction, set, toJS} from 'mobx'

export const makeAutoPersist = <T extends {state: unknown}>(
  _this: T,
  name: string
): (() => void) => {
  // Only run in browser environments
  if (typeof window === 'undefined' || !window?.localStorage) {
    return () => {}
  }

  try {
    const storedJson = window.localStorage.getItem(name)
    if (storedJson) {
      const parsed = JSON.parse(storedJson)
      const thisStateKeys = ObjUtil.keys(_this.state ?? {})
      const storedStateKeys = ObjUtil.keys(parsed?.state ?? {})

      if (ArrUtil.areListsEqual(thisStateKeys, storedStateKeys)) {
        set(_this, parsed)
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // log in dev only
      // eslint-disable-next-line no-console
      console.warn('makeAutoPersist: failed to restore persisted state', err)
    }
  }

  const disposer: IReactionDisposer = reaction(
    () => toJS(_this.state ?? {}),
    state => {
      try {
        window.localStorage.setItem(name, JSON.stringify({state}))
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // log in dev only
          // eslint-disable-next-line no-console
          console.warn('makeAutoPersist: failed to save state', err)
        }
      }
    },
    {delay: 300}
  )

  return () => disposer()
}
