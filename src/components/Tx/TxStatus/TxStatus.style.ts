import styled from 'styled-components'
import { palette } from 'styled-theme'

import { media } from 'helpers/style'

export type RoundValue = 'left' | 'right'

export const TxStatusWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  ${(props: { round: RoundValue }) =>
    props.round === 'right'
      ? `
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      `
      : `
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
  `};
  background: ${palette('gray', 1)};
  text-transform: uppercase;

  height: 20px;
  padding: 8px 8px;
  ${media.sm`
    height: 30px;
    padding: 10px 18px;
  `}

  .txStatus-type {
    font-size: 10px;
    letter-spacing: 0.7px;
    padding-right: 6px;
    color: ${palette('text', 2)};
    ${media.sm`
      font-size: 12px;
      letter-spacing: 1px;
      padding-right: 20px;
    `}
  }

  p {
    margin: 0;
  }
`

export const TxStatusContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-transform: uppercase;

  .txStatus-amount,
  .txStatus-asset {
    color: ${palette('text', 0)};
    font-size: 13px;
    letter-spacing: 0.7px;
    padding: 0 2px;
    ${media.sm`
      font-size: 15px;
      letter-spacing: 1px;
      padding: 0 2px;
    `}
  }

  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`

export const Seperator = styled.div`
  width: 1px;
  height: 20px;
  border-left: 1px solid ${palette('gray', 2)};
  margin: 0 2px;
  ${media.sm`
    margin: 0 15px;
  `}
`
