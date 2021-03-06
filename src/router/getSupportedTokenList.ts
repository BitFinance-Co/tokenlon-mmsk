import { getSupportedTokens } from '../utils/token'

export const getSupportedTokenList = (ctx) => {
  const tokenList = getSupportedTokens()
  ctx.body = {
    result: true,
    tokens: tokenList.map(({ symbol, opposites }) => {
      return { symbol, opposites }
    }),
  }
}