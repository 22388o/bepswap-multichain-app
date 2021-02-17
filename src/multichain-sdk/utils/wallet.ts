import { Chain } from '@xchainjs/xchain-util'
import { BigNumber } from 'bignumber.js'

import { Wallet } from '../clients/types'
import { Asset, AssetAmount, Pool, Amount } from '../entities'

export const getWalletAssets = (wallet: Wallet | null) => {
  const assets: Asset[] = []

  if (!wallet) return assets

  wallet.balance.forEach((data: AssetAmount) => {
    assets.push(data.asset)
  })

  return assets
}

export const getWalletAddressByChain = (
  wallet: Wallet,
  chain: Chain,
): string | null => {
  if (chain in wallet) {
    return wallet?.address ?? null
  }

  return null
}

export const getAssetUSDPrice = (asset: Asset, pools: Pool[]): BigNumber => {
  const assetPool = pools.find((pool) => pool.asset.eq(asset))

  if (!assetPool) return new BigNumber(0)

  return new BigNumber(assetPool.detail.assetPriceUSD)
}

export const getAssetBalance = (asset: Asset, wallet: Wallet): AssetAmount => {
  const emptyAmount = new AssetAmount(
    asset,
    Amount.fromBaseAmount(0, asset.decimal),
  )

  return (
    wallet.balance.find((assetData: AssetAmount) =>
      assetData.asset.eq(asset),
    ) || emptyAmount
  )
}

export const getTotalUSDPriceInBalance = (
  balance: AssetAmount[],
  pools: Pool[],
): BigNumber => {
  let total = new BigNumber(0)

  if (!balance.length) return total

  balance.forEach((assetBalance: AssetAmount) => {
    const usdPrice = getAssetUSDPrice(assetBalance.asset, pools)

    total = total.plus(assetBalance.amount.assetAmount.multipliedBy(usdPrice))
  })

  return total
}
