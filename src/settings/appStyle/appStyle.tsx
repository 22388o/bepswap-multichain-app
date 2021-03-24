import { transparentize } from 'polished'
import styled, { createGlobalStyle } from 'styled-components'
import { palette } from 'styled-theme'

import normalFont from 'assets/font/Exo2-Regular.otf'

import 'antd/dist/antd.dark.css'
import 'antd/dist/antd.css'

export const fontConfig = {
  custom: {
    families: ['Exo 2'],
  },
}

export const ThemedGlobalStyle = createGlobalStyle`
  body {
    min-height: 100vh;
    background-color: ${palette('background', 3)};
  }
`

export const AppHolder = styled.div`
  @font-face {
    font-family: 'Exo 2';
    src: url(${normalFont});
    font-weight: normal;
    font-display: fallback;
  }

  font-family: 'Exo 2';

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  b,
  p,
  li,
  input,
  textarea,
  span,
  div,
  img,
  th,
  td,
  svg {
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &::selection {
      background: ${palette('primary', 0)};
      color: ${palette('background', 1)};
    }
  }

  a,
  button,
  input,
  span,
  .ant-tabs-tab-btn,
  .ant-slider > div,
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-tabs-nav .ant-tabs-tab {
    transition: none;
  }

  .ant-spin.ant-spin-spinning {
    .ant-spin-dot-item {
      background-color: ${palette('primary', 0)};
    }
  }

  .ant-notification-notice {
    background: ${palette('background', 1)};
    color: ${palette('text', 0)};

    .ant-notification-notice-message {
      color: ${palette('text', 0)};
    }
    .ant-notification-notice-close {
      svg {
        color: ${palette('text', 0)} !important;
      }
    }
  }
  
  .app-layout {
    background-repeat: no-repeat;
    background-image: ${({ theme }) =>
      `radial-gradient(50% 50% at 50% 50%, ${transparentize(
        0.9,
        '#23DCC8',
      )} 0%, ${transparentize(1, theme.palette.background[0])} 100%)`};
    }
  }

  .ant-popover {
    .ant-popover-content {
      background: ${(props) =>
        transparentize(0.4, props.theme.palette.background[0])};
      border: 1px solid ${palette('gray', 0)};
      border-radius: 8px;
    }
    .ant-popover-arrow {
      border-bottom: none;
      border-right: none;
      border-color: ${palette('gray', 0)};
    }
    .ant-popover-inner {
      border: 1px solid ${palette('gray', 0)};
      background-color: ${(props) =>
        transparentize(0.4, props.theme.palette.background[0])};
    }
  }

  .ant-popover-inner-content {
    padding: 6px;
    font-size: 11px;
    letter-spacing: 0.5px;
    font-family: 'Exo 2';
    src: url(${normalFont});
  }

  .ant-row:not(.ant-form-item) {
    ${'' /* margin-left: -8px;
    margin-right: -8px; */};
    &:before,
    &:after {
      display: none;
    }
  }

  .ant-row > div {
    padding: 0;
  }

  .ant-table table,
  .ant-table th,
  .ant-table td {
    border-radius: 0px !important;
  }
`
