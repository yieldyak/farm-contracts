import { HardhatUserConfig, task } from "hardhat/config"
import "@nomiclabs/hardhat-waffle"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "./tasks/GondolaDeploy"

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.2",
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: 43114,
      forking: {
        url: 'https://api.avax.network/ext/bc/C/rpc', 
        enabled: true
      },
      accounts: {
        accountsBalance: "10000000000000000000000000000000000", 
        count: 50 
      }
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: []
    },
    mainnet: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: []
    }
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    enabled: true,
    showTimeSpent: true, 
    outputFile: "gasReporterOutput.json",
    gasPrice: 225,
    url: "http://127.0.0.1:8545/"
  },
}

export default config