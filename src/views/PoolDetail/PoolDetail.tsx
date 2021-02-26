import React from 'react'

import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { SwapOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'
import { TxTable, Helmet, Button, AssetData, PoolStats } from 'components'
import { Asset, Pool } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import { getSwapRoute } from 'settings/constants'

import * as Styled from './PoolDetail.style'

const PoolDetail = () => {
  const { asset } = useParams<{ asset: string }>()
  const { pools, poolLoading } = useMidgard()

  const poolAsset = Asset.fromAssetString(asset)

  if (!poolAsset || poolLoading) return null

  const pool = Pool.byAsset(poolAsset, pools)

  if (pool) {
    return <PoolDetailView pool={pool} />
  }

  return null
}

const PoolDetailView = ({ pool }: { pool: Pool }) => {
  const swapRouter = getSwapRoute(Asset.RUNE(), pool.asset)

  return (
    <Styled.Container>
      <Helmet title="" content="BEPSwap Multichain web app" />
      <Styled.Header>
        <Styled.PoolInfo>
          <AssetData asset={pool.asset} />
        </Styled.PoolInfo>
        <Link to={swapRouter}>
          <Button round>
            <SwapOutlined />
            SWAP
          </Button>
        </Link>
      </Styled.Header>
      <Styled.Section>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <PoolStats pool={pool} />
          </Col>
          <Col xs={24} sm={24} md={16}>
            <Styled.Chart pool={pool} />
          </Col>
        </Row>
      </Styled.Section>
      <TxTable asset={pool.asset.toString()} />
    </Styled.Container>
  )
}

export default PoolDetail
