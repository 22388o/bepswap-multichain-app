import { KeyStore as KeystoreType } from '@binance-chain/javascript-sdk/lib/crypto'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import {
  getKeystore,
  saveKeystore,
  saveAddress,
  getAddress,
} from 'helpers/storage'

import * as walletActions from './actions'
import { State } from './types'

const initialState: State = {
  keystore: getKeystore(),
  address: getAddress(),
  wallet: null,
  walletLoading: false,
  isConnectModalOpen: false,
}

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWallet(
      state,
      action: PayloadAction<{ keystore: KeystoreType; address: string }>,
    ) {
      const { keystore, address } = action.payload

      state.keystore = keystore
      state.address = address
      saveKeystore(keystore)
      saveAddress(address)
    },
    setIsConnectModalOpen(state, action: PayloadAction<boolean>) {
      state.isConnectModalOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletActions.loadWallet.pending, (state) => {
        state.walletLoading = true
      })
      .addCase(walletActions.loadWallet.fulfilled, (state, action) => {
        state.wallet = action.payload
        state.walletLoading = false
      })
      .addCase(walletActions.loadWallet.rejected, (state) => {
        state.walletLoading = false
      })
  },
})

export const { reducer, actions } = slice

export default slice
