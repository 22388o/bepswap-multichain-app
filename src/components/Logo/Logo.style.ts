import styled from 'styled-components'
import { palette } from 'styled-theme'

export const LogoWrapper = styled.div`
  display: block;
  cursor: pointer;

  #Thorchain_logo-copy {
    > :not(:first-child) {
      fill: ${palette('text', 1)};
    }
  }
`

export const BepswapIconWrapper = styled.div`
  svg {
    height: 26px;
  }
`
