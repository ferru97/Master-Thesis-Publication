const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

module.exports = {
  networks: {
    ganache: {
      host: '192.168.1.2',
      port: 7545,
      network_id: '5777',
    },
    geth: {
      host: '192.168.1.2',
      port: 8545,
      network_id: '1337',
    },
  },
  compilers: {
    solc: {
      version: '0.7.2',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },
  },
}
