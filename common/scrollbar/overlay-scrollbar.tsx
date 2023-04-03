import {OverlayScrollbarsComponent} from 'overlayscrollbars-react'
import {ReactNode} from 'react'

interface Props {
  children: ReactNode
}

export const OverlayScrollbar = ({children}: Props) => {
  return (
    <OverlayScrollbarsComponent
      defer
      options={{scrollbars: {autoHide: 'scroll'}}}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}
