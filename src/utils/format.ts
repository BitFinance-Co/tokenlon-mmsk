import * as _ from 'lodash'
import { toBN } from './math'
import { isBigNumber } from '../validations'
import { BigNumber } from '0x.js'

const translateValueHelper = (obj: object, check: (v) => boolean, operate: (v) => any): any => {
  let result = {}
  _.keys(obj).forEach((key) => {
    const v = obj[key]
    result[key] = check(v) ? operate(v) : v
  })
  return result
}

export const orderBNToString = (order) => {
  let result = {}
  result = translateValueHelper(order, isBigNumber, (v) => v.toString())
  return result
}

export const fromUnitToDecimalBN = (balance, decimal): BigNumber => {
  const amountBN = toBN(balance || 0)
  const decimalBN = toBN(10).toPower(decimal)
  // 避免出现小数点的情况
  return toBN(Math.round(amountBN.times(decimalBN).toNumber()))
}

export const fromDecimalToUnit = (balance, decimal) => {
  return toBN(balance).dividedBy(Math.pow(10, decimal))
}

export const fromUnitToDecimal = (balance, decimal, base) => {
  return fromUnitToDecimalBN(balance, decimal).toString(base)
}