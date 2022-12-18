require("@nomicfoundation/hardhat-toolbox");
const parse = require("env-file-reader").parse

const envs = parse('.env')
const ALCHEMY_API_KEY = envs.REACT_APP_ALCHEMY_API_KEY
const PRIVATE_KEY = envs.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: './src/artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    }
  }
};
