import {IconCircleX} from '@tabler/icons-react'
import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'
import {Button} from './button'

interface Props
  extends PropsWithChildren,
    React.DialogHTMLAttributes<HTMLDialogElement> {
  className?: HTMLProps<HTMLElement>['className']
}

interface PropsModal extends Props {
  open: boolean
  backdrop?: boolean
  onClickBackdrop?: () => void
  close?: () => void
}

export const Modal = ({
  open,
  backdrop,
  onClickBackdrop,
  close,
  className,
  children,
  ...props
}: PropsModal) => {
  return (
    <dialog
      className={twJoin('modal', className, open && 'modal-open')}
      {...props}
    >
      <div className="modal-box">
        {close && <Close close={close} />}
        {children}
      </div>
      {backdrop && <Backdrop onClickBackdrop={onClickBackdrop} />}
    </dialog>
  )
}

interface PropsClose {
  close: PropsModal['close']
}

const Close = ({close}: PropsClose) => {
  return (
    <Button
      size="sm"
      shape="circle"
      className="absolute right-2 top-2"
      onClick={close}
      color="ghost"
    >
      <IconCircleX />
    </Button>
  )
}

interface PropsBackdrop {
  onClickBackdrop: PropsModal['onClickBackdrop']
}

const Backdrop = ({onClickBackdrop}: PropsBackdrop) => {
  return <div className="modal-backdrop" onClick={onClickBackdrop} />
}

interface PropsBox extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
}

Modal.Header = ({children, ...props}: PropsBox) => {
  return <div {...props}>{children}</div>
}

Modal.Body = ({children, ...props}: PropsBox) => {
  return <div {...props}>{children}</div>
}
