import urlJoin from 'url-join'
import { isString, ary } from 'lodash'
import log from 'Utilities/log'

const createPath = (...paths) => {
  const fullPath = paths
    .map((path) => path && path.path ? path.path : path)
    .filter(isString)
    .reduce(ary(urlJoin, 2))
  const pathParamNames = fullPath
    .split('/')
    .filter((token) => token.startsWith(':'))
    .map((token) => token.slice(1))

  log.debug(`Created path ${fullPath}`)

  const subPathParams = (...params) => {
    let substitutedPath = fullPath
    pathParamNames.forEach((paramName, i) => {
      const paramValue = params[i]
      if (paramValue) {
        substitutedPath = substitutedPath.replace(`:${paramName}`, paramValue)
      }
    })
    return substitutedPath
  }
  subPathParams.path = fullPath
  return subPathParams
}

export const dashboard = createPath('/dashboard')
export const swap = createPath('/swap')
export const connect = createPath('/connect')
export const connectHwWallet = createPath(connect, '/hw/:walletType')
export const connectHwWalletAsset = createPath(connectHwWallet, '/:assetSymbol')
export const connectHwWalletAssetConfirm = createPath(connectHwWalletAsset, '/confirm')
export const connectHwWalletAssetAccounts = createPath(connectHwWalletAsset, '/accounts')

export default {
  dashboard,
  swap,
  connect,
  connectHwWallet,
  connectHwWalletAsset,
  connectHwWalletAssetConfirm,
  connectHwWalletAssetAccounts,
}
