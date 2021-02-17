import { useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { KeyStore as KeystoreType } from '@binance-chain/javascript-sdk/lib/crypto'

import { RootState } from 'redux/store'
import * as walletActions from 'redux/wallet/actions'
import { actions } from 'redux/wallet/slice'

export const useWallet = () => {
  const dispatch = useDispatch()

  const walletState = useSelector((state: RootState) => state.wallet)

  const unlockWallet = useCallback(
    async (keystore: KeystoreType, address: string) => {
      dispatch(
        actions.connectWallet({
          keystore,
          address,
        }),
      )
      dispatch(walletActions.loadWallet())
    },
    [dispatch],
  )

  return {
    ...walletState,
    ...walletActions,
    unlockWallet,
  }
}
