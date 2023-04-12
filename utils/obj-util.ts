type ByKey<T> = keyof T
// @ts-expect-error:  Type 'T[keyof T]' is not assignable to type 'string | number | symbol'
type Accumulator<T> = {[key in T[ByKey<T>]]?: T}

export class ObjUtil {
  public static fromEntries<T>(arr: T[], by: ByKey<T>): Accumulator<T> {
    return arr.reduce((acc, item) => {
      const byValue = item[by]
      acc[byValue] = item
      return acc
    }, {} as Accumulator<T>)
  }
}
