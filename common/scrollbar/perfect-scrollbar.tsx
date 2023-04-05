import {usePerfectScrollbar} from '@/hooks/use-perfect-scrollbar'
import {ReactNode} from 'react'

interface Props {
  children: ReactNode
}

export const PerfectScrollbar = ({children}: Props) => {
  const [ref] = usePerfectScrollbar<HTMLDivElement>()
  return <div ref={ref}>{children}</div>
}
