import { KeyStore as KeystoreType } from '@binance-chain/javascript-sdk/lib/crypto'
import { ThemeType } from '@thorchain/asgardex-theme'
import { Asset } from 'multichain-sdk'

const THEME_TYPE = 'THEME_TYPE'
const BEPSWAP_MULTICHAIN_KEYSTORE = 'BEPSWAP_MULTICHAIN_KEYSTORE'
const BEPSWAP_MULTICHAIN_ADDR = 'BEPSWAP_MULTICHAIN_ADDR'

const BASE_CURRENCY = 'BASE_CURRENCY'

export const saveBaseCurrency = (currency: string) => {
  localStorage.setItem(BASE_CURRENCY, currency)
}

export const getBaseCurrency = (): string => {
  return (
    (localStorage.getItem(BASE_CURRENCY) as string) || Asset.USD().toString()
  )
}

export const saveTheme = (themeType: ThemeType) => {
  localStorage.setItem(THEME_TYPE, themeType)
}

export const getTheme = (): ThemeType => {
  return (localStorage.getItem(THEME_TYPE) as ThemeType) || ThemeType.LIGHT
}

export const saveKeystore = (keystore: KeystoreType) => {
  sessionStorage.setItem(BEPSWAP_MULTICHAIN_KEYSTORE, JSON.stringify(keystore))
}

export const getKeystore = (): KeystoreType | null => {
  const item = sessionStorage.getItem(BEPSWAP_MULTICHAIN_KEYSTORE)

  if (item) {
    return JSON.parse(item) as KeystoreType
  }
  return null
}

export const saveAddress = (address: string) => {
  sessionStorage.setItem(BEPSWAP_MULTICHAIN_ADDR, address)
}

export const getAddress = (): string | null => {
  const item = sessionStorage.getItem(BEPSWAP_MULTICHAIN_ADDR)

  if (item) {
    return item
  }
  return null
}
