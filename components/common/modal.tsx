import {Modal as ModalComponent} from '@/components/daisyui/modal'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {ReactNode} from 'react'

interface Props {
  id: string
  header: ReactNode
  body: ReactNode
  goBack: () => void
  open: boolean
}

export const Modal = ({id, header, body, goBack, open}: Props) => {
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
    >
      <ModalComponent.Header className="font-bold text-base-content/80">
        {header}
      </ModalComponent.Header>
      <ModalComponent.Body>{body}</ModalComponent.Body>
    </ModalComponent>
  )
}
