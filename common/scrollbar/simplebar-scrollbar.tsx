import {ReactNode} from 'react'

interface Props {
  children: ReactNode
}

export const SimpleBarScrollbar = ({children}: Props) => {
  return <div className="scrollbar">{children}</div>
}
