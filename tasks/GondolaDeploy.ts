import { task } from "hardhat/config"
import "@nomiclabs/hardhat-waffle"

task("deployMiniYakFarm", "Deploys the MiniYak/YakToken farm in Gondola", async (args, hre) => {
  await hre.run("compile");
  const {ethers} = hre;
  const swapDeployer = await ethers.getContractAt("ISwapDeployer", "0xAFfaEde8C42044F6c96322286E3083532dcB8199");
  const swapAddress = "0x898A5b9968D50b32A57911eEdd0480ac0C5774bc";
  const miniYakAddress = "0xdDAaAD7366B455AfF8E7c82940C43CEB5829B604";
  const yakTokenAddress = "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7";
  const INITIAL_A = 40;
  const SWAP_FEE = 2e6;
  const ADMIN_FEE = 0;
  const WITHDRAW_FEE = 0;
  const lpTokenAddress = "0x0c18f273Bf5a4F2bad43373A306CaE18d068c7F1";
  let miniYakSwapAddress: string = "";
  let triggerPromise = new Promise((resolve, reject) => {
    swapDeployer.on("NewSwapPool", (deployer, newSwapAddress, pooledTokens) => {
      console.log("======= New deployed swap pool info =======");
      console.log(`Deployer ${deployer}, address ${newSwapAddress}`);
      console.log("Pooled Tokens:");
      for (let i = 0; i < pooledTokens.length; i++) {
          let tokenName = "YakToken"
          if (pooledTokens[i] == miniYakAddress) {
            tokenName = "MiniYak"
          }
          console.log(`${i}. ${pooledTokens[i]} - ${tokenName}`);
      }
      miniYakSwapAddress = newSwapAddress;
      resolve(0);
    });
    // After 30s, we throw a timeout error
    setTimeout(() => {
        reject(new Error('timeout while waiting for event'));
    }, 30000);
  });
  console.log("======= Deploying =======");
  const mySigner = (await ethers.getSigners())[0];
  const previousBalance = await mySigner.getBalance()
  const txReceipt = await swapDeployer.deploy(
    swapAddress, [miniYakAddress, yakTokenAddress], [12, 18],
    "Gondola YAK/mYAK (gondolaYAKPool)", "gondolaYAKPool", INITIAL_A, SWAP_FEE, ADMIN_FEE,
    WITHDRAW_FEE, lpTokenAddress
  )
  console.log(txReceipt);
  console.log(`Deployment tx-id: ${txReceipt.hash}`);
  console.log(`Gas used in $AVAX: ${previousBalance.sub(await mySigner.getBalance()).toString()}`)
  await triggerPromise;
  const miniYakSwap = await ethers.getContractAt("ISwap", miniYakSwapAddress);
  const yakLpTokenAddress = (await miniYakSwap.swapStorage()).lpToken;
  console.log(`LPToken: ${yakLpTokenAddress}`);
  const yakLpToken = await ethers.getContractAt("ERC20", yakLpTokenAddress);
  console.log(`LPToken name and symbol: ${await yakLpToken.name()}, ${await yakLpToken.symbol()}`)
})
