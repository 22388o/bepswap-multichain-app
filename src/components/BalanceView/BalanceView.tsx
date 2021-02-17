import React from 'react'

import {
  Wallet,
  SupportedChain,
  AssetAmount,
  Asset,
  getTotalUSDPriceInBalance,
  formatBigNumber,
} from 'multichain-sdk'

import { AssetData } from 'components/Assets'
import { ChainHeader } from 'components/ChainHeader'

import { useMidgard } from 'redux/midgard/hooks'

import * as Styled from './BalanceView.style'

export type BalanceViewProps = {
  wallet: Wallet
  onSendAsset?: (asset: Asset) => void
}

export const BalanceView = (props: BalanceViewProps) => {
  const { wallet, onSendAsset = () => {} } = props
  const { pools } = useMidgard()

  const renderBalance = (balance: AssetAmount[]) => {
    return balance.map((data: AssetAmount, index) => (
      <Styled.BalanceRow key={index}>
        <AssetData asset={data.asset} amount={data.amount} decimal={3} />
        <Styled.SendBtn
          onClick={() => onSendAsset(data.asset)}
          fixedWidth={false}
        >
          Send
        </Styled.SendBtn>
      </Styled.BalanceRow>
    ))
  }

  const renderChainBalance = (chain: SupportedChain, chainBalance: Wallet) => {
    const { address, balance } = chainBalance
    const usdPrice = getTotalUSDPriceInBalance(balance, pools)
    const totalPrice = formatBigNumber(usdPrice, 2)

    return (
      <Styled.ChainContainer>
        <ChainHeader chain={chain} address={address} totalPrice={totalPrice} />
        {renderBalance(balance)}
      </Styled.ChainContainer>
    )
  }

  return (
    <Styled.Container>{renderChainBalance('BNB', wallet)}</Styled.Container>
  )
}
