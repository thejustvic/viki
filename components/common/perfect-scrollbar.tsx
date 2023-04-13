import {ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import ReactPerfectScrollbar from 'react-perfect-scrollbar'

interface Props {
  children: ReactNode
}

export const PerfectScrollbar = ({children}: Props) => {
  if (isMobile) {
    return <>{children}</>
  }
  return (
    <ReactPerfectScrollbar
      options={{
        wheelPropagation: false,
        minScrollbarLength: 30
      }}
    >
      {children}
    </ReactPerfectScrollbar>
  )
}
