import EthereumjsWallet from 'ethereumjs-wallet'
import { loadUserData } from 'blockstack'
import { stripHexPrefix } from 'Utilities/helpers'
import EthereumWalletKeystore from './EthereumWalletKeystore'

const privateKeyToKeystore = (privateKeyString) => EthereumjsWallet.fromPrivateKey(Buffer.from(stripHexPrefix(privateKeyString.trim()), 'hex'))

export default class EthereumWalletBlockstack extends EthereumWalletKeystore {

  static type = 'EthereumWalletBlockstack';

  constructor(appPrivateKey) {
    super(privateKeyToKeystore(appPrivateKey))
    this.setPersistAllowed(false)
  }

  static create() { return new EthereumWalletBlockstack(loadUserData().appPrivateKey) }

  getType() { return EthereumWalletBlockstack.type }

  getTypeLabel() { return 'Blockstack' }
}
