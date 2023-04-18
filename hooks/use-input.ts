import {useEffect, useState} from 'react'

export const useInput = (
  initialValue: string,
  onInput?: () => void
): [string, (e: {target: {value: string}}) => void, (val: string) => void] => {
  const [val, setVal] = useState(initialValue)

  useEffect(() => {
    setVal(initialValue)
  }, [initialValue])

  const onChange = (e: {target: {value: string}}): void => {
    setVal(e.target.value || '')
    onInput?.()
  }

  return [val, onChange, setVal]
}
