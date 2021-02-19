import React from 'react'

import { BepswapIcon, ThorChainIcon } from 'components/Icons'

import { LogoWrapper, BepswapIconWrapper } from './Logo.style'

export type Props = {
  type: 'thorchain' | 'bepswap'
}

export const Logo = (props: Props) => {
  const { type } = props

  return (
    <LogoWrapper>
      {type === 'thorchain' ? (
        <ThorChainIcon />
      ) : (
        <BepswapIconWrapper>
          <BepswapIcon />
        </BepswapIconWrapper>
      )}
    </LogoWrapper>
  )
}
