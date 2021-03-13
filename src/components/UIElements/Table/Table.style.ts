import { Table } from 'antd'
import { TableProps } from 'antd/lib/table'
import { darken, transparentize } from 'polished'
import styled from 'styled-components'
import { key, palette } from 'styled-theme'

import { media } from 'helpers/style'

export declare type SizeType = 'small' | 'middle' | 'large' | undefined

type Props = {
  sizeValue: SizeType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & TableProps<any>

export const TableWrapper = styled(Table)<Props>`
  border: 1px solid ${palette('gray', 0)};
  background: transparent;

  .ant-table,
  .ant-table-container,
  .ant-table-content,
  .ant-table-thead,
  .ant-table-tbody {
    background: transparent;
    & > tr {
      background: transparent;
    }
  }

  .ant-table-thead > tr > th {
    height: ${(props: Props) =>
      props.sizeValue === 'small' ? '52px' : '70px'};

    border-top: none;
    border-radius: none;
    border-color: ${palette('gray', 0)};
    font-size: ${key('sizes.font.normal', '12px')};
    color: ${palette('text', 2)};
    background: ${(props) =>
      transparentize(0.1, props.theme.palette.background[1])};
    text-transform: uppercase;
    text-align: center;
    &:hover {
      background-color: ${(props) =>
        darken(0.05, props.theme.palette.background[2])} !important;
    }

    .ant-table-column-title {
      padding-top: 6px;
    }
  }

  .ant-table-placeholder {
    background: ${(props) =>
      transparentize(0.1, props.theme.palette.background[1])};
    border-color: ${palette('gray', 0)};
    td {
      &:hover {
        background: ${(props) =>
          transparentize(0.1, props.theme.palette.background[1])};
      }
    }

    .ant-empty-normal {
      color: ${palette('text', 2)};
      .ant-empty-image svg {
        color: ${palette('text', 2)};
        path {
          fill: ${palette('background', 1)};
        }
      }
    }
  }

  .ant-table-tbody > tr > td {
    height: ${(props) => (props.sizeValue === 'small' ? '48px' : '64px')};
    border-color: ${palette('gray', 0)};
    color: ${palette('text', 0)};
    background: ${(props) =>
      transparentize(0.1, props.theme.palette.background[1])};
    text-align: center;
    text-transform: uppercase;
  }

  .ant-table-thead
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-thead
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background-color: ${(props) =>
      darken(0.05, props.theme.palette.background[2])} !important;
  }

  .ant-table-cell {
    padding-top: 4px;
    padding-right: 2px;
    padding-left: 2px;
    padding-bottom: 2px;
    ${media.lg`
      padding-top: 8px;
      padding-right: 4px;
      padding-left: 4px;
      padding-bottom: 8px;
    `}

    &:first-child {
      padding-left: 12px;
    }
    &:last-child {
      padding-right: 12px;
    }

    padding-top: ${(props) => props.sizeValue === 'small' && '0px'} !important;
    padding-bottom: ${(props) =>
      props.sizeValue === 'small' && '0px'} !important;
  }
`
