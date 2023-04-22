import {autorun, set, toJS} from 'mobx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeAutoPersist = (_this: any, name: string): void => {
  const storedJson = localStorage.getItem(name)
  if (storedJson) {
    set(_this, JSON.parse(storedJson))
  }
  autorun(() => {
    const value = toJS(_this)
    localStorage.setItem(name, JSON.stringify(value))
  })
}
