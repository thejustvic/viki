import {ArrUtil} from '@/utils/arr-util'
import {ObjUtil} from '@/utils/obj-util'
import {autorun, set, toJS} from 'mobx'

export const makeAutoPersist = <T extends {state: unknown}>(
  _this: T,
  name: string
): void => {
  const storedJson = window?.localStorage?.getItem(name)

  if (storedJson) {
    const thisStateKeys = ObjUtil.keys(_this.state)
    const storedStateKeys = ObjUtil.keys(JSON.parse(storedJson)?.state)

    if (ArrUtil.areListsEqual(thisStateKeys, storedStateKeys)) {
      set(_this, JSON.parse(storedJson))
    }
  }
  autorun(() => {
    const value = toJS(_this)
    window?.localStorage?.setItem(name, JSON.stringify(value))
  })
}
