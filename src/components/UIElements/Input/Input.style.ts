import { Input } from 'antd'
import styled from 'styled-components'
import { palette, key } from 'styled-theme'

import { TypeValue, SizeValue, Color } from './types'

const fontSettings = {
  small: {
    size: key('sizes.font.small', '10px'),
    spacing: '0.5px',
  },
  normal: {
    size: '14px',
    spacing: '0.5px',
  },
  big: {
    size: '20px',
    spacing: '0.75px',
  },
}

const sizes = {
  small: '20px',
  normal: '25px',
  big: '36px',
}

const colors = {
  primary: palette('primary', 0),
  success: palette('success', 0),
  warning: palette('warning', 0),
  error: palette('error', 0),
}

type Props = {
  typevalue: TypeValue
  sizevalue: SizeValue
  color: Color
}

export const InputWrapper = styled(Input)<Props>`
  &.ant-input-affix-wrapper,
  &.ant-input {
    height: ${(props) => sizes[props.sizevalue]};
    font-size: ${(props) => fontSettings[props.sizevalue].size};
    letter-spacing: ${(props) => fontSettings[props.sizevalue].spacing};
    ${(props) => props.typevalue === 'ghost' && 'border: none;'};
    ${(props) => props.typevalue === 'ghost' && 'background: #F0F3F7;'};

    border: 1px solid ${palette('gray', 0)};
    background: ${palette('background', 1)};
    color: ${palette('text', 0)};
    input,
    input:-internal-autofill-selected {
      color: ${palette('text', 0)};
      background: ${palette('background', 1)};
    }

    &:hover,
    &:focus {
      border-color: ${(props) => colors[props.color]};
      --antd-wave-shadow-color: ${(props) => colors[props.color]};
      box-shadow: ${(props) =>
        props.typevalue === 'ghost'
          ? 'none'
          : `0 0 0 2px ${colors[props.color]}`};
    }
  }

  .ant-input-prefix {
    display: flex;
    align-items: center;
  }
`
