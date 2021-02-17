import styled from 'styled-components'
import { palette } from 'styled-theme'

type Props = {
  size: number
}

export const StepBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 9px;

  .step-end-dot,
  .step-start-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${palette('gray', 1)};
  }

  .step-bar-line {
    width: 5px;
    ${(props: Props) => `height: ${props.size}px;`};
    border-right: 1px solid ${palette('gray', 1)};
  }
`
