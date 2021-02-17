import { createAsyncThunk } from '@reduxjs/toolkit'

import { multichain } from 'services/multichain'

export const loadWallet = createAsyncThunk(
  'midgard/loadWallet',
  multichain.loadWallet,
)
