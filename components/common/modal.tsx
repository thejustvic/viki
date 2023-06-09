import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {IconCircleX} from '@tabler/icons-react'
import {ReactNode} from 'react'
import {Button, Modal as ModalComponent} from 'react-daisyui'

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
    <ModalComponent open={open} onClickBackdrop={goBack}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={goBack}
        color="ghost"
      >
        <IconCircleX />
      </Button>
      <ModalComponent.Header className="font-bold">
        {header}
      </ModalComponent.Header>
      <ModalComponent.Body>{body}</ModalComponent.Body>
    </ModalComponent>
  )
}
