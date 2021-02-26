import { PoolDetail } from 'midgard-sdk'
import invariant from 'tiny-invariant'

import { MULTICHAIN_DECIMAL } from 'multichain-sdk/constants'

import { Amount } from './amount'
import { Asset } from './asset'

export interface IPool {
  readonly asset: Asset
  readonly runeDepth: Amount
  readonly assetDepth: Amount
  readonly assetUSDPrice: Amount

  readonly detail: PoolDetail

  assetPriceInRune: Amount
  runePriceInAsset: Amount
  involvesAsset(asset: Asset): boolean
  priceOf(asset: Asset): Amount
  depthOf(asset: Asset): Amount
}

export class Pool implements IPool {
  public readonly asset: Asset

  public readonly runeDepth: Amount

  public readonly assetDepth: Amount

  public readonly assetUSDPrice: Amount

  public readonly detail: PoolDetail

  // get Pool by non-rune asset
  public static byAsset(asset: Asset, pools: Pool[]): Pool | undefined {
    if (!asset.isRUNE()) {
      return pools.find((pool: Pool) => asset.eq(pool.asset))
    }
  }

  public static fromPoolData(poolDetail: PoolDetail): Pool | null {
    const { asset, runeDepth, assetDepth } = poolDetail
    const assetObj = Asset.fromAssetString(asset)

    if (assetObj && runeDepth && assetDepth) {
      const runeAmount = Amount.fromBaseAmount(runeDepth, MULTICHAIN_DECIMAL)
      const assetAmount = Amount.fromBaseAmount(assetDepth, MULTICHAIN_DECIMAL)

      return new Pool(assetObj, runeAmount, assetAmount, poolDetail)
    }

    return null
  }

  constructor(
    asset: Asset,
    runeDepth: Amount,
    assetDepth: Amount,
    detail: PoolDetail,
  ) {
    this.asset = asset
    this.runeDepth = runeDepth
    this.assetDepth = assetDepth
    this.detail = detail

    this.assetUSDPrice = Amount.fromAssetAmount(
      detail.assetPriceUSD,
      MULTICHAIN_DECIMAL,
    )
  }

  get assetPriceInRune(): Amount {
    return this.runeDepth.div(this.assetDepth)
  }

  get runePriceInAsset(): Amount {
    return this.assetDepth.div(this.runeDepth)
  }

  involvesAsset(asset: Asset): boolean {
    return asset.isRUNE() || this.asset.eq(asset)
  }

  priceOf(asset: Asset): Amount {
    invariant(this.involvesAsset(asset), 'Invalid asset')

    if (asset.isRUNE()) return this.runePriceInAsset
    return this.assetPriceInRune
  }

  depthOf(asset: Asset): Amount {
    invariant(this.involvesAsset(asset), 'Invalid asset')

    if (asset.isRUNE()) return this.runeDepth
    return this.assetDepth
  }
}
