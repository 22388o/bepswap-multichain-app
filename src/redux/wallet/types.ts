import { KeyStore as KeystoreType } from '@binance-chain/javascript-sdk/lib/crypto'
import { Wallet } from 'multichain-sdk'

export interface State {
  keystore: KeystoreType | null
  wallet: Wallet | null
  address: string | null
  walletLoading: boolean
}
