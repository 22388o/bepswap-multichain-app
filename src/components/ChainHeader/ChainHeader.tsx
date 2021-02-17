import React, { useCallback } from 'react'

import { LinkOutlined, CopyOutlined } from '@ant-design/icons'
import { Chain } from '@xchainjs/xchain-util'
import copy from 'copy-to-clipboard'

import { multichain } from 'services/multichain'

import * as Styled from './ChainHeader.style'

export type ChainHeaderProps = {
  chain: Chain
  address: string
  totalPrice?: string
}

export const ChainHeader = (props: ChainHeaderProps) => {
  const { address, totalPrice = '0' } = props

  const miniAddress = `${address.slice(0, 3)}...${address.slice(-3)}`

  const handleCopyAddress = useCallback(() => {
    copy(address)
  }, [address])

  const explorer = multichain.bnb.getClient().getExplorerAddressUrl(address)

  return (
    <Styled.Container>
      <Styled.ChainInfo>
        <Styled.InfoLabel weight="bold">Binance Chain</Styled.InfoLabel>
        <Styled.InfoLabel weight="bold">
          Total: {totalPrice} USD
        </Styled.InfoLabel>
      </Styled.ChainInfo>
      <Styled.Address onClick={handleCopyAddress}>
        <Styled.AddressLabel weight="bold">{miniAddress}</Styled.AddressLabel>
        <CopyOutlined />
      </Styled.Address>
      <Styled.Reload>
        <a href={explorer} target="_blank" rel="noopener noreferrer">
          <LinkOutlined />
        </a>
      </Styled.Reload>
    </Styled.Container>
  )
}
