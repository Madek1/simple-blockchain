const crypto = require('crypto')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const moment = require('moment')

module.exports = class Transaction {
    constructor({ sourceAddress, destinationAddress, amount }) {
        this.sourceAddress = sourceAddress
        this.destinationAddress = destinationAddress
        this.amount = amount
        this.timestamp = moment().unix()
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.sourceAddress + this.destinationAddress + this.amount + this.timestamp)
            .digest('hex')
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.sourceAddress) {
            throw new Error('You cannot sign transactions for other wallets!')
        }

        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex')
    }

    isValid() {
        if (this.sourceAddress === null) {
            return true
        }

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction')
        }

        const publicKey = ec.keyFromPublic(this.sourceAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}
