const deployFarm = async (args, hre) => {
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
  let miniYakSwapAddress = "";
  const triggerPromise = new Promise((resolve, reject) => {
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
    swapAddress, [miniYakAddress, yakTokenAddress], [18, 18],
    "Gondola YAK/mYAK (gondolaYAKPool)", "gondolaYAKPool", INITIAL_A, SWAP_FEE, ADMIN_FEE,
    WITHDRAW_FEE, lpTokenAddress
  )
  console.log(txReceipt);
  console.log(`Deployment tx-id: ${txReceipt.hash}`);
  console.log(`Gas used in $AVAX: ${previousBalance.sub(await mySigner.getBalance()).toString()}`)
  await triggerPromise;
  let miniYakSwap = await ethers.getContractAt("ISwap", miniYakSwapAddress);
  const yakLpTokenAddress = (await miniYakSwap.swapStorage()).lpToken;
  console.log(`LPToken: ${yakLpTokenAddress}`);
  const yakLpToken = await ethers.getContractAt("ERC20", yakLpTokenAddress);
  console.log(`LPToken name and symbol: ${await yakLpToken.name()}, ${await yakLpToken.symbol()}`)
  return [miniYakSwap, yakLpToken];
}

function getAmountOut(amountIn, reserveIn, reserveOut) {
    const amountInWithFee = amountIn.mul(997);
    const numerator = amountInWithFee.mul(reserveOut);
    const denominator = reserveIn.mul(1000).add(amountInWithFee);
    return numerator.div(denominator);
}

const fundYak = async function(hre) {
  await hre.run("compile");
  const {ethers} = hre;
  const yakAvaxPair = await ethers.getContractAt("IPair","0xd2f01cd87a43962fd93c21e07c1a420714cc94c9");
  const WAVAX = await ethers.getContractAt("IWAVAX", "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7");
  await WAVAX.deposit({value: "1000000000000000000000"});
  let amountIn = "100000000000000000000";
  await WAVAX.transfer(yakAvaxPair.address, "100000000000000000000");
  let [reserve0, reserve1, _] = await yakAvaxPair.getReserves()
  if (await yakAvaxPair.token0() != WAVAX.address) {
    [reserve0, reserve1] = [reserve1, reserve0]
  }
  let [amount0, amount1] = [ethers.BigNumber.from(0), getAmountOut(ethers.BigNumber.from(amountIn), reserve0, reserve1)]
  if (await yakAvaxPair.token0() != WAVAX.address) {
    [amount0, amount1] = [amount1, amount0]
  }
  const mySigner = (await ethers.getSigners())[0]
  await yakAvaxPair.swap(amount0, amount1, mySigner.address, [])
}

const fundMiniYakSwap = async function(hre, miniYakSwapAddress, miniYakAddress, yakAddress) {
  const {ethers} = hre;
  const yakToken = await ethers.getContractAt("ERC20", yakAddress);
  const miniYakToken = await ethers.getContractAt("MiniYak", miniYakAddress);
  const miniYakSwap = await ethers.getContractAt("ISwap", miniYakSwapAddress);
  const mySigner = (await ethers.getSigners())[0]
  await yakToken.approve(miniYakSwap.address, ethers.constants.MaxUint256);
  await miniYakToken.approve(miniYakSwap.address, ethers.constants.MaxUint256);
  fundYak(hre)
  yakToken.approve(miniYakToken.address, ethers.constants.MaxUint256);
  miniYakToken.moon((await yakToken.balanceOf(mySigner.address)).div(100), mySigner.address)
  let miniYakBalance = await miniYakToken.balanceOf(mySigner.address)
  miniYakSwap.addLiquidity([miniYakBalance.div(4), miniYakBalance.div(4)], 0, Math.floor(Date.now() / 1000) + 60 * 20 * 4)
}
