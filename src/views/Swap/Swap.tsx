import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { SwapOutlined } from '@ant-design/icons'
import { BNBChain } from '@xchainjs/xchain-util'
import {
  ContentTitle,
  Helmet,
  AssetInputCard,
  Slider,
  Input,
  ConfirmModal,
  Information,
  Notification,
  IconButton,
  Button,
  FancyButton,
  SettingsOverlay,
} from 'components'
import {
  getWalletAssets,
  Amount,
  Asset,
  AssetAmount,
  getAssetBalance,
  getWalletAddressByChain,
  Swap,
  Percent,
  Price,
} from 'multichain-sdk'

import { useApp } from 'redux/app/hooks'
import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import useNetworkFee from 'hooks/useNetworkFee'

import { multichain } from 'services/multichain'

import { getSwapRoute, getPoolDetailRouteFromAsset } from 'settings/constants'

import * as Styled from './Swap.style'
import { Pair } from './types'
import { getSwapPair } from './utils'

const SwapView = () => {
  const { pair } = useParams<{ pair: string }>()

  const swapPair = getSwapPair(pair)

  if (swapPair) {
    const { inputAsset, outputAsset } = swapPair
    return <SwapPage inputAsset={inputAsset} outputAsset={outputAsset} />
  }

  return null
}

const SwapPage = ({ inputAsset, outputAsset }: Pair) => {
  const history = useHistory()
  const { wallet } = useWallet()
  const { pools, poolLoading } = useMidgard()
  const { slippageTolerance } = useApp()

  const poolAssets = useMemo(() => {
    const assets = pools.map((pool) => pool.asset)
    assets.push(Asset.RUNE())

    return assets
  }, [pools])
  const inputAssets = useMemo(() => {
    if (wallet) {
      const walletAssets = getWalletAssets(wallet)

      return walletAssets.filter((asset: Asset) =>
        poolAssets.find((poolAsset) => poolAsset.eq(asset)),
      )
    }

    return poolAssets.filter((poolAsset) => poolAsset.chain === BNBChain)
  }, [wallet, poolAssets])

  const [inputAmount, setInputAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [percent, setPercent] = useState(0)
  const [recipient, setRecipient] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const networkFee = useNetworkFee()

  const swap: Swap | null = useMemo(() => {
    if (poolLoading) return null

    try {
      const inputAssetAmount = new AssetAmount(inputAsset, inputAmount)
      return new Swap(
        inputAsset,
        outputAsset,
        pools,
        inputAssetAmount,
        slippageTolerance,
      )
    } catch (error) {
      console.log(error)
    }

    return null
  }, [
    inputAsset,
    outputAsset,
    pools,
    inputAmount,
    slippageTolerance,
    poolLoading,
  ])
  const outputAmount: Amount = useMemo(() => {
    if (swap) {
      return swap.outputAmount.amount
    }

    return Amount.fromAssetAmount(0, 8)
  }, [swap])

  const slipPercent: Percent = useMemo(
    () => (swap ? swap.slip : new Percent(0)),
    [swap],
  )

  const rate: string = useMemo(
    () =>
      swap
        ? `1 ${swap.inputAsset.ticker} = ${swap.price.toFixedInverted(3)} ${
            swap.outputAsset.ticker
          }`
        : '',
    [swap],
  )

  const minReceive: Amount = useMemo(
    () => (swap ? swap.minOutputAmount : Amount.fromAssetAmount(0, 8)),
    [swap],
  )

  const inputAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: inputAsset,
        pools,
        priceAmount: inputAmount,
      }),
    [inputAsset, inputAmount, pools],
  )

  const outputAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: outputAsset,
        pools,
        priceAmount: outputAmount,
      }),
    [outputAsset, outputAmount, pools],
  )

  useEffect(() => {
    if (wallet) {
      const address = getWalletAddressByChain(wallet, outputAsset.chain)
      setRecipient(address || '')
    }
  }, [wallet, outputAsset])

  const inputAssetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(inputAsset, wallet).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [inputAsset, wallet])

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value
      setRecipient(addr)
    },
    [],
  )

  const handleSelectInputAsset = useCallback(
    (input: Asset) => {
      history.push(getSwapRoute(input, outputAsset))
    },
    [history, outputAsset],
  )

  const handleSelectOutputAsset = useCallback(
    (output: Asset) => {
      history.push(getSwapRoute(inputAsset, output))
    },
    [history, inputAsset],
  )

  const handleSwitchPair = useCallback(() => {
    history.push(getSwapRoute(outputAsset, inputAsset))
  }, [history, inputAsset, outputAsset])

  const handleChangeInputAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(inputAssetBalance)) {
        setInputAmount(inputAssetBalance)
        setPercent(100)
      } else {
        setInputAmount(amount)
        setPercent(
          amount.div(inputAssetBalance).mul(100).assetAmount.toNumber(),
        )
      }
    },
    [inputAssetBalance],
  )

  const handleChangePercent = useCallback(
    (p: number) => {
      setPercent(p)
      const newAmount = inputAssetBalance.mul(p).div(100)
      setInputAmount(newAmount)
    },
    [inputAssetBalance],
  )

  const handleSelectMax = useCallback(() => {
    handleChangePercent(100)
  }, [handleChangePercent])

  const handleConfirm = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet && swap) {
      const txHash = await multichain.swap(swap, recipient)

      const txURL = multichain.bnb.getClient().getExplorerTxUrl(txHash)

      Notification({
        type: 'open',
        message: 'View Swap Tx.',
        description: 'Transaction sent successfully!',
        btn: (
          <a href={txURL} target="_blank" rel="noopener noreferrer">
            View Transaction
          </a>
        ),
        duration: 20,
      })
      console.log('txhash', txHash)
    }
  }, [wallet, swap, recipient])

  const handleCancel = useCallback(() => {
    setVisibleConfirmModal(false)
  }, [])

  const handleSwap = useCallback(() => {
    if (wallet && swap) {
      if (swap.hasInSufficientFee) {
        Notification({
          type: 'error',
          message: 'Swap Insufficient Fee',
          description: 'Input amount is not enough to cover the fee',
        })
        return
      }

      setVisibleConfirmModal(true)
    } else {
      Notification({
        type: 'error',
        message: 'Wallet Not Found',
        description: 'Please connect wallet',
      })
    }
  }, [wallet, swap])

  const isValidSwap = useMemo(() => swap?.isValid() ?? false, [swap])
  const isValidSlip = useMemo(() => swap?.isSlipValid() ?? false, [swap])

  const renderConfirmModalContent = useMemo(() => {
    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Send"
          description={`${inputAmount.toFixed()} ${inputAsset.ticker.toUpperCase()}`}
        />
        <Information
          title="Receive"
          description={`${outputAmount.toFixed()} ${outputAsset.ticker.toUpperCase()}`}
        />
        <Information
          title="Slip"
          description={slipPercent.toFixed(2)}
          error={isValidSlip}
        />
        <Information
          title="Minimum Received"
          description={minReceive.toFixed(2)}
        />
        {!!recipient && (
          <Information title="Recipient" description={recipient} />
        )}
      </Styled.ConfirmModalContent>
    )
  }, [
    inputAmount,
    outputAmount,
    inputAsset,
    outputAsset,
    recipient,
    slipPercent,
    isValidSlip,
    minReceive,
  ])

  const title = useMemo(
    () => `Swap ${inputAsset.ticker} >> ${outputAsset.ticker}`,
    [inputAsset, outputAsset],
  )

  const poolAsset = useMemo(
    () => (inputAsset.isRUNE() ? outputAsset : inputAsset),
    [inputAsset, outputAsset],
  )

  return (
    <Styled.Container>
      <Helmet title={title} content={title} />
      <ContentTitle>
        <Styled.HeaderContent>
          <div>{title}</div>
          <Styled.HeaderActions>
            <Link to={getPoolDetailRouteFromAsset(poolAsset)}>
              <Button typevalue="outline" fixedWidth={false} round>
                Pool
              </Button>
            </Link>
            <SettingsOverlay />
          </Styled.HeaderActions>
        </Styled.HeaderContent>
      </ContentTitle>
      <Styled.ContentPanel>
        <AssetInputCard
          title="send"
          asset={inputAsset}
          assets={inputAssets}
          amount={inputAmount}
          balance={inputAssetBalance}
          onChange={handleChangeInputAmount}
          onSelect={handleSelectInputAsset}
          onMax={handleSelectMax}
          usdPrice={inputAssetPriceInUSD}
        />
        <Styled.ToolContainer>
          <Styled.SliderWrapper>
            <Slider value={percent} onChange={handleChangePercent} withLabel />
          </Styled.SliderWrapper>
          <Styled.SwitchPair>
            <IconButton onClick={handleSwitchPair}>
              <SwapOutlined />
            </IconButton>
          </Styled.SwitchPair>
        </Styled.ToolContainer>
        <AssetInputCard
          title="receive"
          asset={outputAsset}
          assets={poolAssets}
          amount={outputAmount}
          onSelect={handleSelectOutputAsset}
          inputProps={{ disabled: true }}
          usdPrice={outputAssetPriceInUSD}
        />
        <Styled.FormItem>
          <Styled.FormLabel>Recipient</Styled.FormLabel>
          <Input
            typevalue="ghost"
            sizevalue="big"
            value={recipient}
            onChange={handleChangeRecipient}
            placeholder="Recipient"
          />
        </Styled.FormItem>

        <Styled.SwapInfo>
          <Information title="Rate" description={rate} />
          <Information
            title="Slip"
            description={slipPercent.toFixed(2)}
            error={!isValidSlip}
          />
          <Information
            title="Minimum Received"
            description={minReceive.toFixed(2)}
          />
          <Information title="Fee" description={networkFee} />
        </Styled.SwapInfo>

        <Styled.ConfirmButtonContainer>
          <FancyButton onClick={handleSwap} error={!isValidSwap}>
            Swap
          </FancyButton>
        </Styled.ConfirmButtonContainer>
      </Styled.ContentPanel>

      <ConfirmModal
        visible={visibleConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        {renderConfirmModalContent}
      </ConfirmModal>
    </Styled.Container>
  )
}

export default SwapView
