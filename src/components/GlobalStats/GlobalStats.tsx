import React from 'react'

import { Row, Col } from 'antd'
import { Percent, Amount } from 'multichain-sdk'

import { useGlobalState } from 'redux/hooks'
import { useMidgard } from 'redux/midgard/hooks'

import { StatsCard } from '../UIElements/StatsCard'

export const GlobalStats: React.FC = (): JSX.Element => {
  const { stats, networkData } = useMidgard()
  const { runeToCurrency } = useGlobalState()

  const bondingAPYLabel = new Percent(networkData?.bondingAPY ?? 0).toFixed(2)
  const liquidityAPYLabel = new Percent(networkData?.liquidityAPY ?? 0).toFixed(
    2,
  )

  const swapVolume = Amount.fromMidgard(stats?.swapVolume)
  const addLiquidityVolume = Amount.fromMidgard(stats?.addLiquidityVolume)
  const withdrawVolume = Amount.fromMidgard(stats?.withdrawVolume)

  const swapCount = Amount.fromNormalAmount(stats?.swapCount)
  const addLiquidityCount = Amount.fromNormalAmount(stats?.addLiquidityCount)
  const withdrawCount = Amount.fromNormalAmount(stats?.withdrawCount)

  const totalVolume = swapVolume.add(addLiquidityVolume).add(withdrawVolume)
  const totalTx = swapCount.add(addLiquidityCount).add(withdrawCount)

  const statsData = React.useMemo(() => {
    return [
      {
        title: 'Total Volume',
        value: runeToCurrency(totalVolume).toCurrencyFormat(0),
      },
      {
        title: 'Total Tx',
        value: totalTx.toFixed(0),
      },
      {
        title: 'Total Rune Depth',
        value: runeToCurrency(
          Amount.fromMidgard(stats?.runeDepth),
        ).toCurrencyFormat(0),
      },
      {
        title: 'Monthly Active Users',
        value: Amount.fromNormalAmount(stats?.monthlyActiveUsers).toFixed(0),
      },
      {
        title: 'Bonding APY',
        value: bondingAPYLabel,
      },
      {
        title: 'Liquidity APY',
        value: liquidityAPYLabel,
      },
    ]
  }, [
    stats,
    bondingAPYLabel,
    liquidityAPYLabel,
    totalVolume,
    totalTx,
    runeToCurrency,
  ])

  return (
    <Row gutter={[16, 16]}>
      {statsData.map((statProps, index) => {
        return (
          <Col
            key={index}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            xl={{ span: 4 }}
          >
            <StatsCard {...statProps} />
          </Col>
        )
      })}
    </Row>
  )
}
