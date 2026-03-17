import {Loader} from '@/components/common/loader'
import tw from '@/components/common/tw-styled-components'
import {HTMLProps, ReactNode} from 'react'

export const TwLoading = tw(Loader)`
  p-0
  flex
  items-start
  w-6
  h-6
`

const TwLoadingWrapper = tw.div`
  flex
  justify-center
  w-full
`

const TwPrefix = tw.span`
  w-20
  pr-2
`

const TwShowData = tw.div`
  flex
`

interface IShowData {
  className?: HTMLProps<HTMLElement>['className']
  loading: boolean
  error: string | undefined
  data: ReactNode
  prefix: string
}
export const CardInfoShowData = ({
  className,
  loading,
  error,
  data,
  prefix
}: IShowData) => {
  return (
    <TwShowData className={className}>
      <TwPrefix>{prefix}</TwPrefix>
      {loading ? (
        <TwLoadingWrapper>
          <TwLoading />
        </TwLoadingWrapper>
      ) : (
        <>
          {error && <p>{error}</p>}
          {data}
        </>
      )}
    </TwShowData>
  )
}
