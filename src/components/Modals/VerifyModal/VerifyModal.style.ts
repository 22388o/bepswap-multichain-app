import styled from 'styled-components'

import { Modal as UnstyledModal } from '../../UIElements'

export const Modal = styled(UnstyledModal)`
  .ant-modal-body {
    padding: 16px 32px;
  }
`

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .label-wrapper {
    padding: 20px 0;
  }
`
