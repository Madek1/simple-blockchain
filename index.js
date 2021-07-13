const P2pServer = require('./p2p/server');
const Blockchain = require('./core/blockchain')
const blockchain = new Blockchain()
const p2pserver = new P2pServer(blockchain);


p2pserver.listen(); // starts the p2pserver
