import { Asset } from 'multichain-sdk'

import { Pair } from './types'

export const getSwapPair = (pair: string): Pair | null => {
  if (!pair || pair.split('_').length !== 2) {
    return null
  }

  const input = pair.split('_')?.[0]
  const output = pair.split('_')?.[1]

  if (!input || !output) return null

  const inputAsset = Asset.fromAssetString(input)
  const outputAsset = Asset.fromAssetString(output)

  if (!inputAsset || !outputAsset) return null

  return {
    inputAsset,
    outputAsset,
  }
}
