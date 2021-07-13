const Block = require('./block')
const Transactions = require('./transaction')
const moment = require('moment')

module.exports = class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.pendingTransactions = []
        this.difficulty = 2
        this.miningReward = 100
    }

    createGenesisBlock() {
        return new Block({
            timestamp: moment().unix(),
            transactions: [],
            previousHash: '0'
        })
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transactions({
            sourceAddress: null,
            destinationAddress: miningRewardAddress,
            amount: this.miningReward
        })
        this.pendingTransactions.push(rewardTx)

        let block = new Block({
            timestamp: moment().unix(),
            transactions: this.pendingTransactions,
            previousHash: this.getLatestBlock().hash
        })
        block.mineBlock(this.difficulty)

        console.log('Block successfully mined!')
        this.chain.push(block)

        this.pendingTransactions = []
    }

    addTransaction(transaction) {
        if (!transaction.sourceAddress || !transaction.destinationAddress) {
            throw new Error('Transaction must include source and destination address')
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain')
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0')
        }

        if (this.getBalanceOfAddress(transaction.sourceAddress) < transaction.amount) {
            throw new Error('Not enough balance')
        }

        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        const balance = this.chain.reduce((acc, block) => {
            for (const transaction of block.transactions) {
                if (transaction.sourceAddress === address) {
                    acc -= transaction.amount
                }

                if (transaction.destinationAddress === address) {
                    acc += transaction.amount
                }
            }
            return acc
        }, 0)
        return balance
    }

    getAllTransactionForWallet(address) {
        const txs = []

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if ([tx.sourceAddress, tx.destinationAddress].includes(address)) {
                    txs.push(tx)
                }
            }
        }
        return txs
    }

    isChainValid() {
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]

            if (!currentBlock.hasValidTransactions()) {
                return false
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }
        }

        return true
    }
}
