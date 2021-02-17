import React, { useCallback } from 'react'

import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

import { SyncOutlined } from '@ant-design/icons'
import { Asset } from 'multichain-sdk'

import { useWallet } from 'redux/wallet/hooks'

import { getSendRoute } from 'settings/constants'

import { BalanceView } from '../BalanceView'
import { Label } from '../UIElements/Label'
import { Drawer } from './WalletDrawer.style'
import * as Styled from './WalletDrawer.style'

export type WalletDrawerProps = {
  visible: boolean
  onClose?: () => void
}

export const WalletDrawer = (props: WalletDrawerProps) => {
  const { visible, onClose = () => {} } = props

  const history = useHistory()
  const dispatch = useDispatch()

  const { loadWallet, walletLoading, wallet } = useWallet()

  const handleRefresh = useCallback(() => {
    dispatch(loadWallet())
  }, [loadWallet, dispatch])

  const handleSendAsset = useCallback(
    (asset: Asset) => {
      history.push(getSendRoute(asset))
    },
    [history],
  )

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      placement="right"
      closable={false}
      width={350}
    >
      <Styled.Refresh onClick={handleRefresh}>
        <Label size="big" color="primary">
          Refresh
        </Label>
        <SyncOutlined spin={walletLoading} />
      </Styled.Refresh>
      {!wallet && <Label>Please connect wallet.</Label>}
      {wallet && <BalanceView wallet={wallet} onSendAsset={handleSendAsset} />}
    </Drawer>
  )
}
