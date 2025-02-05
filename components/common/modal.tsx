import {Modal as ModalComponent} from '@/components/daisyui/modal'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {ReactNode} from 'react'

interface Props {
  header: ReactNode
  body: ReactNode
  goBack: () => void
  open: boolean
}

export const Modal = ({header, body, goBack, open}: Props) => {
  useGlobalKeyDown({
    escape: goBack
  })

  return (
    <ModalComponent
      open={open}
      backdrop
      close={goBack}
      onClickBackdrop={goBack}
    >
      <ModalComponent.Header className="font-bold">
        {header}
      </ModalComponent.Header>
      <ModalComponent.Body>{body}</ModalComponent.Body>
    </ModalComponent>
  )
}
