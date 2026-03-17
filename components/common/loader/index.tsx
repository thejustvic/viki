import tw from '@/components/common/tw-styled-components'
import IconLoader from './loader.svg'

const TwLoader = tw.div`
  h-16
  w-16
  p-2
`

interface Props {
  className?: string
}

export const Loader = ({className}: Props) => {
  return (
    <TwLoader className={className ?? 'text-violet-400'}>
      <IconLoader />
    </TwLoader>
  )
}
