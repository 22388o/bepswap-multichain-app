import React, { useState, useCallback, useEffect } from 'react'

import { Form } from 'antd'
import { ModalProps } from 'antd/lib/modal'

import usePrevious from 'hooks/usePrevious'

import { Label, Input } from '../../UIElements'
import * as Styled from './VerifyModal.style'

export interface Props extends ModalProps {
  description: string
  verifyLevel?: 'normal' | 'high'
  verifyText?: string
  onConfirm: () => void
}

export const VerifyModal: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    description,
    verifyLevel = 'high',
    verifyText = 'CONFIRM',
    onConfirm,
    visible,
    ...otherProps
  } = props

  const [confirmTextValue, setConfirmTextValue] = useState('')
  const [invalidText, setInvalidText] = useState(true)

  const prevVisible = usePrevious(visible)
  useEffect(() => {
    // if modal is closed, reset confirm input
    if (prevVisible === true && visible === false) {
      setConfirmTextValue('')
      setInvalidText(true)
    }
  }, [visible, prevVisible])

  const handleConfirm = useCallback(() => {
    if (confirmTextValue === verifyText) {
      onConfirm()
    }
  }, [onConfirm, confirmTextValue, verifyText])

  const handleChangeConfirmText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value

      if (text === verifyText) {
        setInvalidText(false)
      } else {
        setInvalidText(true)
      }

      setConfirmTextValue(e.target.value)
    },
    [setConfirmTextValue, setInvalidText, verifyText],
  )

  const renderModalContent = () => {
    if (verifyLevel === 'normal') {
      return <Label>{description}</Label>
    }
    const color = invalidText ? 'error' : 'success'

    return (
      <>
        <Label>{description}</Label>
        <Form onFinish={handleConfirm} autoComplete="off">
          <Form.Item className={invalidText ? 'has-error' : ''}>
            <Input
              typevalue="ghost"
              sizevalue="big"
              value={confirmTextValue}
              onChange={handleChangeConfirmText}
              autoComplete="off"
              color={color}
            />
          </Form.Item>
        </Form>
      </>
    )
  }

  const confirmDisabled = verifyLevel === 'high' && invalidText

  return (
    <Styled.Modal
      visible={visible}
      okText="CONFIRM"
      cancelText="CANCEL"
      okButtonProps={{
        className: 'ok-ant-btn',
        disabled: confirmDisabled,
      }}
      onOk={onConfirm}
      {...otherProps}
    >
      <Styled.ModalContent>{renderModalContent()}</Styled.ModalContent>
    </Styled.Modal>
  )
}
