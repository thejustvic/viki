import {Writable} from 'ts-essentials'

export class Util {
  static clone<T>(obj: T): Writable<T> {
    if (typeof obj !== 'object' || !obj) {
      return obj
    }

    if (Array.isArray(obj)) {
      const newArr = []
      for (let i = 0; i < obj.length; i += 1) {
        newArr[i] = this.clone(obj[i])
      }
      return newArr as unknown as T
    }

    const newObj: any = {}
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        newObj[k] = this.clone(obj[k])
      }
    }
    return newObj
  }
}
