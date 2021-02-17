import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Amount, Asset, AssetAmount } from 'multichain-sdk'

import { BalanceView, BalanceViewProps } from './BalanceView'

export default {
  title: 'Components/BalanceView',
  component: BalanceView,
} as Meta

const Template: Story<BalanceViewProps> = (args) => <BalanceView {...args} />

export const Default = Template.bind({})
Default.args = {
  wallet: {
    address: 'bnbaddress123',
    balance: [new AssetAmount(Asset.BNB(), Amount.fromAssetAmount(123, 8))],
  },
}
