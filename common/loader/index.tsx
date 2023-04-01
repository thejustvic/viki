import tw from 'tailwind-styled-components'
import IconLoader from './loader.svg'

const TwLoader = tw.div<{className: string}>`
  h-16
  w-16
  p-2
  ${p => p.className}
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
