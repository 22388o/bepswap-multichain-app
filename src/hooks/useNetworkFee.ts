import { useState, useEffect } from 'react'

import { Amount } from 'multichain-sdk'

import { multichain } from 'services/multichain'

const useNetworkFee = (): string => {
  const [networkFee, setNetworkFee] = useState('')

  useEffect(() => {
    const getFeeValue = async () => {
      let feeStr = ''

      setNetworkFee('...')
      try {
        const feeValue = await multichain.getFees()
        feeStr = Amount.fromBaseAmount(feeValue.fastest.amount(), 8).toFixed(8)
      } catch (error) {
        console.log('quote fee error', error)
      }

      setNetworkFee(`${feeStr} BNB`)
    }

    getFeeValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return networkFee
}

export default useNetworkFee
