import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { ToolCard, Props } from './ToolCard'

export default {
  title: 'Components/ToolCard',
  component: ToolCard,
} as Meta

const Template: Story<Props> = (args) => <ToolCard {...args} />

export const Default = Template.bind({})
Default.args = {}
