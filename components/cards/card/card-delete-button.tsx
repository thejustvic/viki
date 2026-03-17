import tw from '@/components/common/tw-styled-components'
import {Button} from '@/components/daisyui/button'
import {IconTrash} from '@tabler/icons-react'

interface ITwButton {
  $isVisible: boolean
}
const TwButton = tw(Button)<ITwButton>`
  ${({$isVisible}) => ($isVisible ? 'opacity-100' : 'opacity-0')}
  self-start
`

interface CardDeleteButtonProps {
  remove: () => void
  isVisible?: boolean
}
export const CardDeleteButton = ({
  remove,
  isVisible = true
}: CardDeleteButtonProps) => {
  return (
    <TwButton
      soft
      shape="circle"
      size="sm"
      onClick={remove}
      $isVisible={isVisible}
    >
      <IconTrash size={16} />
    </TwButton>
  )
}
