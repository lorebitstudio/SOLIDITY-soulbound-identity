require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("hardhat-tracer");
require("dotenv").config();

const IS_MAINNET = process.env.IS_MAINNET === "true";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: false,
      evmVersion: "cancun"
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: IS_MAINNET ? process.env.BASE_MAINNET_PROV : process.env.BASE_TESTNET_PROV,
        //blockNumber: 28491610,
      },
      mining: {
        auto: true,
        interval: [3000, 5000],
      },
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      forking: {
        url: IS_MAINNET ? process.env.BASE_MAINNET_PROV : process.env.BASE_TESTNET_PROV,
        // blockNumber: 321922670
      },
      mining: {
        auto: true,
        interval: [3000, 5000],
      },
      timeout: 120000, // 120 seconds
    },
    base: {
      url: process.env.BASE_MAINNET_PROV,
      accounts: [`0x${process.env.MAINNET_PRIVATE_KEY}`],
    },
    baseSepolia: {
      chainId: 84532,
      url: process.env.BASE_TESTNET_PROV,
      accounts: [`0x${process.env.TESTNET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey:process.env.ETHSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "ETH",
    gasPrice: 0.024,
  },
  mocha: {
    bail: true,
    timeout: 0,
  },
  tracing: true,
};
