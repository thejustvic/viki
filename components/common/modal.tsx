import {Modal as ModalComponent} from '@/components/daisyui/modal'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {HTMLProps, ReactNode} from 'react'
import tw from './tw-styled-components'

const TwModalComponentHeader = tw(ModalComponent.Header)`
  font-bold
  text-base-content/80
`

interface Props {
  id: string
  header: ReactNode
  body: ReactNode
  goBack: () => void
  open: boolean
  classNameModalBox?: HTMLProps<HTMLElement>['className']
  classNameBody?: HTMLProps<HTMLElement>['className']
}
export const Modal = ({
  id,
  header,
  body,
  goBack,
  open,
  classNameModalBox,
  classNameBody
}: Props) => {
  useGlobalKeyDown({
    handlers: {
      escape: goBack
    },
    id,
    active: open
  })

  return (
    <ModalComponent
      id={id}
      open={open}
      backdrop
      close={goBack}
      onClickBackdrop={goBack}
      classNameModalBox={classNameModalBox}
    >
      <TwModalComponentHeader>{header}</TwModalComponentHeader>
      <ModalComponent.Body className={classNameBody}>
        {body}
      </ModalComponent.Body>
    </ModalComponent>
  )
}
