import React from 'react'

import { Provider as ReduxProvider, useSelector } from 'react-redux'

import themes, { ThemeType } from '@thorchain/asgardex-theme'
import { WebFontLoader } from 'components'
import { ThemeProvider } from 'styled-components'

import { store as reduxStore, RootState } from 'redux/store'

import { AppHolder, fontConfig, ThemedGlobalStyle } from 'settings/appStyle'

import Router from './router'

const Main = () => {
  const themeType = useSelector((state: RootState) => state.app.themeType)
  const isLight = themeType === ThemeType.LIGHT
  const { light, dark } = themes
  const defaultTheme = isLight ? light : dark

  return (
    <ThemeProvider theme={defaultTheme}>
      <ThemedGlobalStyle />
      <AppHolder id="app-global">
        <Router />
      </AppHolder>
    </ThemeProvider>
  )
}

function App() {
  return (
    <WebFontLoader config={fontConfig}>
      <ReduxProvider store={reduxStore}>
        <Main />
      </ReduxProvider>
    </WebFontLoader>
  )
}

export default App
