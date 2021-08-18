import { expect, use } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat"
import {fundMiniYakSwap} from "./utils/Dex"

describe("Farm", async function () {
    let yakToken: Contract
    let miniYakToken: Contract
    let miniYakSwap: Contract

    before(async function() {
        //this makes sure the newest changes are compiled and pushed to the fork node
        yakToken = await ethers.getContractAt("ERC20", "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7");
        miniYakToken = await ethers.getContractAt("MiniYak", "0xdDAaAD7366B455AfF8E7c82940C43CEB5829B604");
    });

    beforeEach(async function() {
        const swapDeployer = await ethers.getContractAt("ISwapDeployer", "0xAFfaEde8C42044F6c96322286E3083532dcB8199");
        const baseSwapAddress = "0x898A5b9968D50b32A57911eEdd0480ac0C5774bc";
        const INITIAL_A = 10000;
        const SWAP_FEE = 2e6;
        const ADMIN_FEE = 0;
        const WITHDRAW_FEE = 0;
        const baseLpTokenAddress = "0x0c18f273Bf5a4F2bad43373A306CaE18d068c7F1";
        let miniYakSwapAddress: string = "";
        let triggerPromise = new Promise((resolve, reject) => {
            swapDeployer.on("NewSwapPool", (deployer, newSwapAddress, pooledTokens) => {
                miniYakSwapAddress = newSwapAddress;
                resolve(0);
            });
            // After 30s, we throw a timeout error
            setTimeout(() => {
                reject(new Error('timeout while waiting for event'));
            }, 30000);
        });
        await swapDeployer.deploy(
            baseSwapAddress, [miniYakToken.address, yakToken.address], [18, 18],
            "Gondola YAK/mYAK (gondolaYAKPool)", "gondolaYAKPool", INITIAL_A, SWAP_FEE, ADMIN_FEE,
            WITHDRAW_FEE, baseLpTokenAddress
        )
        await triggerPromise;
        miniYakSwap = await ethers.getContractAt("ISwap", miniYakSwapAddress)
    });
    
    [1, 100, 1000, 100000000, "100000000000000000"].forEach(amount => {
        it(`Can swap 1:1 amount ${amount}`, async function() {
            // this adds funds to the miniYakSwap and also to the account(signers[0])
            await fundMiniYakSwap("0xd2f01cd87a43962fd93c21e07c1a420714cc94c9", miniYakSwap.address, miniYakToken.address, yakToken.address)
            let bigNumberAmount = BigNumber.from(amount)
            //it's an almost comparison(between 99% and 101%) because of swapFee
            expect(await miniYakSwap.calculateSwap(0, 1, bigNumberAmount)).to.be.gte(bigNumberAmount.mul(99).div(100))
            expect(await miniYakSwap.calculateSwap(0, 1, bigNumberAmount)).to.be.lte(bigNumberAmount.mul(101).div(100))

            expect(await miniYakSwap.calculateSwap(1, 0, bigNumberAmount)).to.be.gte(bigNumberAmount.mul(99).div(100))
            expect(await miniYakSwap.calculateSwap(1, 0, bigNumberAmount)).to.be.lte(bigNumberAmount.mul(101).div(100))
        })
    });
    
})
