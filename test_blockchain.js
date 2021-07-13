const Blockchain = require('./core/blockchain')
const Transaction = require('./core/transaction')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const blockchain = new Blockchain()

const myKey = ec.keyFromPrivate('e827b4fc51e75d7c85e6b3d9d5dd4569811f3df85e85e631f343410d39dffb29')
const myWallet = myKey.getPublic('hex')


blockchain.minePendingTransactions(myWallet)
console.log(blockchain.getBalanceOfAddress(myWallet))

const tx1 = new Transaction({
    sourceAddress: myWallet,
    destinationAddress: 'public key',
    amount: 10
})
tx1.signTransaction(myKey)
blockchain.addTransaction(tx1)

blockchain.minePendingTransactions(myWallet)
console.log(blockchain.getBalanceOfAddress(myWallet))
