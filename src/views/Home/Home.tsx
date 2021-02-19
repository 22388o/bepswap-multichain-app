import React, { useState, useCallback, useMemo } from 'react'

import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { SyncOutlined, SwapOutlined, SearchOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table'
import {
  TxTable,
  GlobalStats,
  GlobalChart,
  AssetIcon,
  Helmet,
  PoolStatusFilter,
  Table,
  Button,
  Input,
} from 'components'
import { PoolStatus } from 'midgard-sdk'
import { Amount, Asset, Percent, Pool } from 'multichain-sdk'
import { AlignType } from 'rc-table/lib/interface'

import { useMidgard } from 'redux/midgard/hooks'

import { getSwapRoute, getPoolDetailRoute } from 'settings/constants'

import * as Styled from './Home.style'

const Home = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { actions, pools, poolLoading } = useMidgard()

  const [selectedPoolStatus, setSelectedPoolStatus] = useState<PoolStatus>(
    'available',
  )

  const [keyword, setKeyword] = useState('')

  const handleLoadPoolData = useCallback(() => {
    dispatch(actions.getPools(selectedPoolStatus))
  }, [dispatch, actions, selectedPoolStatus])

  const handleSelectPoolStatus = useCallback((status: PoolStatus) => {
    setSelectedPoolStatus(status)
  }, [])

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

  const centerAlign = 'center' as AlignType
  const rightAlign = 'right' as AlignType

  const poolActions = useMemo(
    () => ({
      key: 'action',
      align: centerAlign,
      title: (
        <Styled.ActionContainer>
          <Button
            onClick={handleLoadPoolData}
            typevalue="outline"
            round
            fixedWidth={false}
          >
            <SyncOutlined />
            refresh
          </Button>
        </Styled.ActionContainer>
      ),
      render: (_: string, pool: Pool) => {
        const swapRouter = getSwapRoute(Asset.RUNE(), pool.asset)

        return (
          <Styled.ActionContainer>
            <Link to={swapRouter} onClick={(e) => e.stopPropagation()}>
              <Button round>
                <SwapOutlined />
                SWAP
              </Button>
            </Link>
          </Styled.ActionContainer>
        )
      },
    }),
    [handleLoadPoolData],
  )

  const poolColumns: ColumnType<Pool>[] = useMemo(
    () => [
      {
        key: 'Pool',
        title: 'Pool',
        render: (pool: Pool) => <AssetIcon asset={pool.asset} />,
        align: centerAlign,
      },
      {
        key: 'Symbol',
        title: 'Symbol',
        align: centerAlign,
        render: (pool: Pool) => pool.asset.ticker,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) => a.asset.sortsBefore(b.asset),
      },
      {
        key: 'Price',
        title: 'USD Price',
        render: (pool: Pool) =>
          `$${Amount.fromAssetAmount(pool.detail.assetPriceUSD, 8).toFixed(3)}`,
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Amount.fromAssetAmount(a.detail.assetPriceUSD, 8),
            Amount.fromAssetAmount(b.detail.assetPriceUSD, 8),
          ),
      },
      {
        key: 'Depth',
        title: 'Depth',
        render: (pool: Pool) =>
          Amount.fromMidgard(pool.detail.runeDepth).mul(2).toFixed(0),
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Amount.fromMidgard(a.detail.runeDepth),
            Amount.fromMidgard(b.detail.runeDepth),
          ),
      },
      {
        key: 'Volume24h',
        title: 'Volume 24h',
        render: (pool: Pool) =>
          Amount.fromMidgard(pool.detail.volume24h).toFixed(0),
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Amount.fromMidgard(a.detail.volume24h),
            Amount.fromMidgard(b.detail.volume24h),
          ),
      },
      {
        key: 'APY',
        title: 'APY',
        render: (pool: Pool) =>
          `${new Percent(pool.detail.poolAPY).toFixed(0)}%`,
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Percent.fromMidgard(a.detail.poolAPY),
            Percent.fromMidgard(b.detail.poolAPY),
          ),
      },
      poolActions,
    ],
    [poolActions],
  )

  const filteredPools = useMemo(() => {
    if (!keyword) return pools

    return pools.filter((pool) =>
      pool.asset.toString().toLowerCase().includes(keyword),
    )
  }, [pools, keyword])

  const renderPoolview = useMemo(
    () => (
      <Table
        columns={poolColumns}
        dataSource={filteredPools}
        loading={poolLoading}
        onRow={(record: Pool) => ({
          onClick: () => history.push(getPoolDetailRoute(record)),
        })}
        rowKey="key"
      />
    ),
    [poolColumns, filteredPools, poolLoading, history],
  )

  return (
    <Styled.HomeContainer>
      <Helmet title="Asgardex" content="Multichain Asgardex web app" />
      <Styled.Section>
        <GlobalStats />
      </Styled.Section>
      <Styled.Section>
        <GlobalChart />
      </Styled.Section>
      <PoolStatusFilter
        selected={selectedPoolStatus}
        onClick={handleSelectPoolStatus}
      />
      <Styled.PoolTableView>
        <Input
          prefix={<SearchOutlined />}
          sizevalue="big"
          placeholder="Search pools..."
          value={keyword}
          onChange={handleChangeKeyword}
        />
        {renderPoolview}
      </Styled.PoolTableView>
      <TxTable />
    </Styled.HomeContainer>
  )
}

export default Home
