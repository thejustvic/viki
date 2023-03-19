import {useState} from 'react'

interface BooleanHookState {
  value: boolean
  turnOn(): void
  turnOff(): void
  toggle(): void
  setValue(v: boolean): void
}

export const useBoolean = (initial: boolean): BooleanHookState => {
  const [val, setVal] = useState(initial)
  return {
    value: val,
    turnOn: () => setVal(true),
    turnOff: () => setVal(false),
    toggle: () => setVal(v => !v),
    setValue: v => setVal(v)
  }
}
