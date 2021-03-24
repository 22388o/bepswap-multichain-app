import React, { useCallback } from 'react'

import { KeyStore as KeystoreType } from '@binance-chain/javascript-sdk/lib/crypto'
import { Overlay, Helmet } from 'components'

import { useWallet } from 'redux/wallet/hooks'

import KeystoreView from './Keystore'
import * as Styled from './WalletModal.style'

const ConnectView = () => {
  const {
    unlockWallet,
    setIsConnectModalOpen,
    isConnectModalOpen,
  } = useWallet()

  const handleConnect = useCallback(
    async (keystore: KeystoreType, address: string) => {
      await unlockWallet(keystore, address)

      setIsConnectModalOpen(false)
    },
    [unlockWallet, setIsConnectModalOpen],
  )

  return (
    <Overlay
      isOpen={isConnectModalOpen}
      onDismiss={() => setIsConnectModalOpen(false)}
    >
      <Styled.ConnectContainer>
        <Helmet title="Connect Wallet" content="Connect Wallet" />
        <Styled.TabContent>
          <KeystoreView onConnect={handleConnect} />
        </Styled.TabContent>
      </Styled.ConnectContainer>
    </Overlay>
  )
}

export default ConnectView
