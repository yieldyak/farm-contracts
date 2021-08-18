import "@nomiclabs/hardhat-waffle";
import {ethers} from "hardhat";
import {BigNumber} from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function getAmountOut(amountIn: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber) {
    const amountInWithFee = amountIn.mul(997);
    const numerator = amountInWithFee.mul(reserveOut);
    const denominator = reserveIn.mul(1000).add(amountInWithFee);
    return numerator.div(denominator);
}

function getAmountIn(amountOut: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber, slippageTolerance: BigNumber) {
    let numerator = amountOut.mul(reserveIn).mul(1000)
    let denominator = reserveOut.sub(amountOut).mul(997)
    let result = numerator.div(denominator)
    return result.add(result.mul(slippageTolerance).div(100))
}

export async function fundTokenFromAVAXPair(pairAddress: string, amount: BigNumber, account: SignerWithAddress) {
    const pair = await ethers.getContractAt("IPair",pairAddress);
    const WAVAX = await ethers.getContractAt("IWAVAX", "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7");
    let [reserve0, reserve1, _] = await pair.getReserves()
    if (await pair.token0() != WAVAX.address) {
        [reserve0, reserve1] = [reserve1, reserve0]
    }

    let amountIn = getAmountIn(amount, reserve0, reserve1, BigNumber.from(5))
    await WAVAX.connect(account).deposit({value: amountIn.mul(2)});
    await WAVAX.connect(account).transfer(pair.address, amountIn);
    
    let [amount0, amount1] = [ethers.BigNumber.from(0), amount]
    if (await pair.token0() != WAVAX.address) {
        [amount0, amount1] = [amount1, amount0]
    }
    const mySigner = (await ethers.getSigners())[0]
    await pair.connect(account).swap(amount0, amount1, mySigner.address, [])
    return amount0.gt(0) ? amount0 : amount1
}

export async function fundMiniYakSwap(yakAvaxPairAddress: string, miniYakSwapAddress: string, miniYakAddress: string, yakAddress: string) {
    const yakToken = await ethers.getContractAt("ERC20", yakAddress);
    const miniYakToken = await ethers.getContractAt("MiniYak", miniYakAddress);
    const miniYakSwap = await ethers.getContractAt("ISwap", miniYakSwapAddress);
    const mySigner = (await ethers.getSigners())[0]
    await yakToken.approve(miniYakSwap.address, ethers.constants.MaxUint256);
    await miniYakToken.approve(miniYakSwap.address, ethers.constants.MaxUint256);
    // 100e18
    await fundTokenFromAVAXPair(yakAvaxPairAddress, BigNumber.from("10000000000000000000"), mySigner)
    yakToken.approve(miniYakToken.address, ethers.constants.MaxUint256);
    miniYakToken.moon((await yakToken.balanceOf(mySigner.address)).div(100), mySigner.address)
    let miniYakBalance = await miniYakToken.balanceOf(mySigner.address)
    miniYakSwap.addLiquidity([miniYakBalance.div(4), miniYakBalance.div(4)], 0, Math.floor(Date.now() / 1000) + 60 * 20 * 4)
}
