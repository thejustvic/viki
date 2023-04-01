import {ReactNode} from 'react'
import PerfectScrollbar, {ScrollBarProps} from 'react-perfect-scrollbar'

interface ScrollProps extends ScrollBarProps {
  children: ReactNode
}

export const Scrollbar = (props: ScrollProps) => {
  const {children, ...otherProps} = props

  return <PerfectScrollbar {...otherProps}>{children}</PerfectScrollbar>
}
