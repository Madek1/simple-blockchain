const crypto = require('crypto')

module.exports = class Block {
    constructor({timestamp, transactions, previousHash = ''}) {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.nonce = 0
        this.hash = this.calculateHash()
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++
            this.hash = this.calculateHash()
        }

        console.log(`Block mined: ${this.hash}`)
    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.valid()) {
                return false
            }
        }
        return true
    }
}
