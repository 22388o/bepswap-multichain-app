import React, { useState, useCallback } from 'react'

import { useHistory } from 'react-router'

import { KeyStore as KeystoreType } from '@binance-chain/javascript-sdk/lib/crypto'
import { Helmet, Tabs, TabPane } from 'components'

import { useWallet } from 'redux/wallet/hooks'

import { HOME_ROUTE } from 'settings/constants'

import * as Styled from './Connect.style'
import KeystoreView from './Keystore'

enum TabType {
  KEYSTORE = 'KEYSTORE',
  LEDGER = 'LEDGER',
  WALLETCONNECT = 'WALLETCONNECT',
}

const ConnectView = () => {
  const history = useHistory()
  const { unlockWallet } = useWallet()

  const [activeTab, setActiveTab] = useState<TabType>(TabType.KEYSTORE)

  const handleChangeTab = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  const handleConnect = useCallback(
    async (keystore: KeystoreType, address: string) => {
      await unlockWallet(keystore, address)

      history.push(HOME_ROUTE)
    },
    [unlockWallet, history],
  )

  return (
    <Styled.ConnectContainer>
      <Helmet title="Connect Wallet" content="Connect Wallet" />
      <Styled.ConnectTabHeader>
        <Tabs activeKey={activeTab} onChange={handleChangeTab} action>
          <TabPane key={TabType.KEYSTORE} tab="Keystore" />
          <TabPane key={TabType.LEDGER} tab="Ledger" disabled />
          <TabPane key={TabType.WALLETCONNECT} tab="Wallet Connect" disabled />
        </Tabs>
      </Styled.ConnectTabHeader>
      <Styled.TabContent>
        {activeTab === TabType.KEYSTORE && (
          <KeystoreView onConnect={handleConnect} />
        )}
      </Styled.TabContent>
    </Styled.ConnectContainer>
  )
}

export default ConnectView
