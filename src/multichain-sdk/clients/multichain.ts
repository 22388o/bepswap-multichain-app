import { crypto } from '@binance-chain/javascript-sdk'
import { KeyStore } from '@binance-chain/javascript-sdk/lib/crypto'
import { TxHash, Network } from '@xchainjs/xchain-client'
import { Chain } from '@xchainjs/xchain-util'
import {
  MidgardV2,
  NetworkType as MidgardNetwork,
  PoolAddress,
} from 'midgard-sdk'

import { Swap, Memo, Asset, AssetAmount } from '../entities'
import { BnbChain } from './binance'
import {
  TxParams,
  AddLiquidityParams,
  WithdrawParams,
  Wallet,
  supportedChains,
} from './types'

// thorchain pool address is empty string
const THORCHAIN_POOL_ADDRESS = ''

export interface IMultiChain {
  chains: typeof supportedChains
  midgard: MidgardV2
  network: string

  wallets: Wallet | null

  bnb: BnbChain

  validateKeystore(keystore: KeyStore, password: string, addr: string): boolean

  getMidgard(): MidgardV2
  getPoolAddressByChain(chain: Chain): Promise<PoolAddress>
  loadWallet(): Promise<Wallet | null>

  transfer(tx: TxParams, native?: boolean): Promise<TxHash>
  swap(swap: Swap, recipient?: string): Promise<TxHash>
  addLiquidity(params: AddLiquidityParams): Promise<TxHash>
  withdraw(params: WithdrawParams): Promise<TxHash>
}

export class MultiChain implements IMultiChain {
  private phrase: string

  private wallet: Wallet | null = null

  public readonly chains = supportedChains

  public readonly midgard: MidgardV2

  public readonly network: Network

  public bnb: BnbChain

  constructor({
    network = 'testnet',
    phrase = '',
  }: {
    network?: Network
    phrase?: string
  }) {
    this.network = network
    this.phrase = phrase

    // create midgard client
    this.midgard = new MidgardV2(MultiChain.getMidgardNetwork(network))

    // create chain clients
    this.bnb = new BnbChain({ network, phrase })
  }

  setPrivateKey = (privateKey: string) => {
    this.bnb.getClient().setPrivateKey(privateKey)

    this.initWallet()
  }

  getPhrase = () => {
    return this.phrase
  }

  // used to validate keystore and password for bnb chain
  validateKeystore = (
    keystore: KeyStore,
    password: string,
    addr: string,
  ): boolean => {
    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(
        JSON.stringify(keystore),
        password,
      )

      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        this.network === 'testnet' ? 'tbnb' : 'bnb',
      )

      if (address === addr) {
        this.setPrivateKey(privateKey)
        return true
      }

      return false
    } catch (error) {
      console.log(error)
    }
    return false
  }

  initWallet = () => {
    this.wallet = {
      address: this.bnb.getClient().getAddress(),
      balance: [],
    }
  }

  /**
   * return midgard network type
   *
   * @param network mainnet or testnet
   */
  public static getMidgardNetwork(network: Network): MidgardNetwork {
    if (network === 'testnet') return 'testnet'
    return 'chaosnet'
  }

  get wallets(): Wallet | null {
    return this.wallet
  }

  /**
   * get midgard client
   */
  getMidgard(): MidgardV2 {
    return this.midgard
  }

  getPoolAddressByChain = async (chain: Chain): Promise<PoolAddress> => {
    try {
      const poolAddress = await this.midgard.getInboundAddressByChain(chain)

      return poolAddress
    } catch (error) {
      return Promise.reject(error)
    }
  }

  loadWallet = async (): Promise<Wallet | null> => {
    try {
      const balance = (await this.bnb?.loadBalance()) ?? []
      const address = this.bnb.getClient().getAddress()
      this.wallet = {
        address,
        balance,
      }

      return {
        address,
        balance,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * transfer on binance chain
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (tx: TxParams): Promise<TxHash> => {
    try {
      return await this.bnb.transfer(tx)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * swap assets
   * @param {Swap} swap Swap Object
   */
  swap = async (swap: Swap, recipient?: string): Promise<TxHash> => {
    /**
     * 1. check if swap has sufficient fee
     * 2. get pool address
     * 3. get swap memo
     * 4. transfer input asset to pool address
     */

    try {
      if (!this.wallet) {
        return await Promise.reject(new Error('Wallet not detected'))
      }

      if (swap.hasInSufficientFee) {
        return await Promise.reject(new Error('Insufficient Fee'))
      }

      const recipientAddress = recipient

      const poolAddress = await this.getPoolAddressByChain(
        swap.inputAsset.chain,
      )
      const memo = Memo.swapMemo(
        swap.outputAsset,
        recipientAddress,
        swap.minOutputAmount, // slip limit
      )

      return await this.transfer({
        assetAmount: swap.inputAmount,
        recipient: poolAddress,
        memo,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * add liquidity to pool
   * @param {AddLiquidityParams} params
   */
  addLiquidity = async (params: AddLiquidityParams): Promise<TxHash> => {
    /**
     * 1. get pool address
     * 2. get add liquidity memo
     * 3. check add type (Sym or Asym add)
     * 4. add liquidity to pool
     */

    try {
      const { pool, runeAmount, assetAmount } = params
      const { chain } = pool.asset

      const poolAddress = await this.getPoolAddressByChain(chain)

      // sym stake
      if (runeAmount && runeAmount.gt(runeAmount._0_AMOUNT)) {
        if (assetAmount.lte(assetAmount._0_AMOUNT)) {
          return await Promise.reject(new Error('Invalid Asset Amount'))
        }

        // 1. send rune (NOTE: recipient should be empty string)
        await this.transfer({
          assetAmount: runeAmount,
          recipient: THORCHAIN_POOL_ADDRESS,
          memo: Memo.depositMemo(Asset.RUNE()),
        })

        // 2. send asset
        return await this.transfer({
          assetAmount,
          recipient: poolAddress,
          memo: Memo.depositMemo(pool.asset),
        })
      }
      // asym stake
      if (assetAmount.lte(assetAmount._0_AMOUNT)) {
        return await Promise.reject(new Error('Invalid Asset Amount'))
      }

      return await this.transfer({
        assetAmount,
        recipient: poolAddress,
        memo: Memo.depositMemo(pool.asset),
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * withdraw asset from pool
   * @param {WithdrawParams} params
   */
  withdraw = async (params: WithdrawParams): Promise<TxHash> => {
    /**
     * 1. get pool address
     * 2. get withdraw memo
     * 3. transfer withdraw tx
     */

    try {
      const { pool, percent } = params
      const memo = Memo.withdrawMemo(pool.asset, percent)
      const { chain } = pool.asset

      const poolAddress = await this.getPoolAddressByChain(chain)

      const txHash = await this.transfer({
        assetAmount: AssetAmount.getMinAmountByChain(chain),
        recipient: poolAddress,
        memo,
      })

      return txHash
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
