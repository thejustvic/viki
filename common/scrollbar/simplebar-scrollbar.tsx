import {ReactNode} from 'react'
import SimpleBar from 'simplebar-react'

interface Props {
  children: ReactNode
}

export const SimpleBarScrollbar = ({children}: Props) => {
  return <SimpleBar>{children}</SimpleBar>
}
