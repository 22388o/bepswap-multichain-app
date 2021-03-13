import { ContentView } from 'components'
import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

export const ConnectContainer = styled(ContentView)`
  border: 1px solid ${palette('gray', 0)};
  border-radius: 14px;
  margin-left: auto;
  margin-right: auto;

  padding-bottom: 24px;
`

export const ConnectTabHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
`

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
`
