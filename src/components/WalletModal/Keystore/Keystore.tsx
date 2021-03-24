import React, { useState, useCallback } from 'react'

import { FilePicker } from 'react-file-picker'

import {
  QuestionCircleOutlined,
  UploadOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'
import { crypto } from '@binance-chain/javascript-sdk'
import { KeyStore } from '@binance-chain/javascript-sdk/lib/crypto'
import { Form, Tooltip } from 'antd'
import { Button, Input, Label } from 'components'

import { getPrefix } from 'services/binance'
import { multichain } from 'services/multichain'

import { config } from 'settings/config'

import * as Styled from './Keystore.style'

type Props = {
  onConnect: (keystore: KeyStore, address: string) => void
}

const KeystoreView = ({ onConnect }: Props) => {
  const [keystore, setKeystore] = useState<KeyStore>()
  const [password, setPassword] = useState<string>('')
  const [invalideStatus, setInvalideStatus] = useState(false)
  const [keystoreError, setKeystoreError] = useState('')
  const [processing, setProcessing] = useState(false)

  const onChangeFile = useCallback((file: Blob) => {
    const reader = new FileReader()
    const onLoadHandler = () => {
      try {
        const key = JSON.parse(reader.result as string)
        if (!('version' in key) || !('crypto' in key)) {
          setKeystoreError('Not a valid keystore file')
        } else {
          setKeystoreError('')
          setKeystore(key)
        }
      } catch {
        setKeystoreError('Not a valid json file')
      }
    }
    reader.addEventListener('load', onLoadHandler)
    reader.readAsText(file)
    return () => {
      reader.removeEventListener('load', onLoadHandler)
    }
  }, [])

  const onErrorFile = useCallback((error: Error) => {
    setKeystoreError(`Selecting a key file failed: ${error}`)
  }, [])

  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalideStatus(false)
    },
    [],
  )

  const handleUnlock = useCallback(() => {
    if (keystore) {
      setProcessing(true)

      try {
        const privateKey = crypto.getPrivateKeyFromKeyStore(
          JSON.stringify(keystore),
          password,
        )
        const address = crypto.getAddressFromPrivateKey(
          privateKey,
          getPrefix(config.network),
        )
        // set private key for bnb chain
        multichain.bnb.getClient().setAddress(address)

        // clean up
        setPassword('')
        setKeystore(undefined)
        setProcessing(false)

        onConnect(keystore, address)
      } catch (error) {
        setProcessing(false)

        setInvalideStatus(true)
        console.error(error)
      }
    }
  }, [keystore, password, onConnect])

  const ready = password.length > 0 && !keystoreError && !processing

  return (
    <Styled.Container>
      <Form onFinish={handleUnlock}>
        <Styled.Content>
          <Styled.FormLabel weight="bold" color="normal">
            Please Select Keystore File
          </Styled.FormLabel>
          <FilePicker onChange={onChangeFile} onError={onErrorFile}>
            <Button color="primary" typevalue="outline" fixedWidth={false}>
              {keystore && !keystoreError && (
                <CheckCircleTwoTone twoToneColor="#50E3C2" />
              )}
              {(!keystore || keystoreError) && <UploadOutlined />}
              Choose File to Upload
            </Button>
          </FilePicker>
          {keystoreError && <Label color="error">{keystoreError}</Label>}
          <Styled.PasswordInput>
            <Styled.PasswordLabel>
              <Label weight="bold" color="normal">
                Decryption password{' '}
              </Label>
              <Tooltip
                title="This is the password used to decrypt your encrypted keystore file"
                placement="topLeft"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Styled.PasswordLabel>
            <Input
              onChange={onPasswordChange}
              placeholder="Password"
              allowClear
              disabled={!keystore}
              type="password"
              sizevalue="big"
            />
            {invalideStatus && <Label color="error">Password is wrong.</Label>}
          </Styled.PasswordInput>
        </Styled.Content>
        <Styled.Footer>
          <Styled.FooterContent>
            <a
              href="https://www.binance.org/en/create"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Label color="primary">Create Wallet</Label>
            </a>
            <Button
              htmlType="submit"
              onClick={handleUnlock}
              disabled={!ready}
              round
              loading={processing}
              fixedWidth={false}
            >
              Unlock Wallet
            </Button>
          </Styled.FooterContent>
        </Styled.Footer>
      </Form>
    </Styled.Container>
  )
}

export default KeystoreView
