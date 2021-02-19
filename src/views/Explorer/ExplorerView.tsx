import React from 'react'

import { Row, Col } from 'antd'
import { Helmet, ToolCard } from 'components'

import { data } from './data'

const ExplorerView: React.FC = (): JSX.Element => {
  return (
    <Row gutter={[16, 16]}>
      <Helmet title="Explorer" content="Explorer" />
      {data.map((props, index) => {
        return (
          <Col
            key={index}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            xl={{ span: 8 }}
          >
            <ToolCard {...props} />
          </Col>
        )
      })}
    </Row>
  )
}

export default ExplorerView
