import BigNumber from 'bignumber.js'

import {
  Rounding,
  Amount,
  EMPTY_FORMAT,
  NUMBER_FORMAT,
  AmountType,
} from './amount'

export class Percent extends Amount {
  constructor(
    amount: BigNumber.Value,
    type: AmountType = AmountType.ASSET_AMOUNT,
  ) {
    // Decimal point for percent is 2
    super(amount, type, 2)
  }

  toSignificant(
    significantDigits = 8,
    format: BigNumber.Format = EMPTY_FORMAT,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return `${super
      .mul(100)
      .toSignificant(significantDigits, format, rounding)} %`
  }

  toFixed(
    decimalPlaces = 8,
    format: BigNumber.Format = NUMBER_FORMAT,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return `${super.mul(100).toFixed(decimalPlaces, format, rounding)} %`
  }
}
