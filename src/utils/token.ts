import * as _ from 'lodash'
import { updaterStack } from '../utils/intervalUpdater'
import { SupportedToken } from '../types'

const helper = (stack, token1, token2) => {
  if (stack[token1] && stack[token1].indexOf(token2) === -1) {
    stack[token1].push(token2)
  } else if (!stack[token1]) {
    stack[token1] = [token2]
  }
}

/**
 * ['SNT/ETH', 'SNT/TUSD'] =>
 * {
 *   SNT: ['ETH', 'TUSD']
 *   ETH: ['SNT']
 *   TUSD: ['SNT']
 * }
 */
const transferPairStrArrToTokenStack = (pairStrArr) => {
  const stack = {}
  pairStrArr.forEach(pairStr => {
    const [tokenA, tokenB] = pairStr.split('/')
    helper(stack, tokenA, tokenB)
    helper(stack, tokenB, tokenA)
  })
  return stack
}

export const getSupportedTokens = (): SupportedToken[] => {
  const { tokenListFromImtokenUpdater, pairsFromMMUpdater } = updaterStack
  const tokenStack = transferPairStrArrToTokenStack(pairsFromMMUpdater.cacheResult)
  const tokenList = tokenListFromImtokenUpdater.cacheResult
  const result = []
  tokenList.forEach(token => {
    const { symbol } = token
    const opposites = tokenStack[symbol]
    if (opposites && opposites.length) {
      result.push({
        ...token,
        opposites: opposites.filter(symbol => !!tokenList.find(t => t.symbol === symbol)),
      })
    }
  })
  return result
}

export const isSupportedBaseQuote = (tokens: SupportedToken[], baseQuote): boolean => {
  return tokens.some(t => {
    return t.symbol === baseQuote.base && t.opposites.indexOf(baseQuote.quote) !== -1
  })
}

export const getTokenBySymbol = (tokens, symbol) => {
  return tokens.find(t => t.symbol === symbol)
}