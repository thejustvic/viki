import {ReactNode} from 'react'
import ReactPerfectScrollbar from 'react-perfect-scrollbar'

interface Props {
  children: ReactNode
}

export const PerfectScrollbar = ({children}: Props) => {
  return <ReactPerfectScrollbar>{children}</ReactPerfectScrollbar>
}