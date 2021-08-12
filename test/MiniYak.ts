import { expect } from "chai"
import { ethers } from "hardhat"
import { run } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts"
import { doesNotMatch } from "assert/strict"

const hre = require("hardhat");
const PGL_ROUTER_ADDRESS = "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106";
const pglRouterABI = require("./abis/PGLRouter.json");
const path_for_router = ["0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7", "0x59414b3089ce2af0010e7523dea7e2b35d776ec7"];
const YAK_ADDRESS = "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7";

describe("MiniYak", async function () {

    let owner: SignerWithAddress
    let account: SignerWithAddress
    let miniYakContract: Contract

    const intial_data_setup = async () => {
        let Router = new ethers.Contract(PGL_ROUTER_ADDRESS, pglRouterABI, account);
        await Router.connect(account).swapExactAVAXForTokens("140399914278898577", path_for_router,
            account.address, "1628769746438", { from: account.address, value: "123950399914278898577" });
      }

    before(async function () {
        //this makes sure the newest changes are compiled and pushed to the fork node
        run("compile")
    })

    beforeEach(async function () {
        owner = (await ethers.getSigners())[0]
        account = (await ethers.getSigners())[1]
        const factory = await ethers.getContractFactory("MiniYak")
        miniYakContract = await factory.connect(owner).deploy()
        // await expect(miniYakContract.deployed()).to.be.reverted
        await miniYakContract.deployed()
        await intial_data_setup().catch();
        
    })

    // it("Can be deployed", async function() {
    //     const factory = await ethers.getContractFactory("MiniYak")
    //     miniYakContract = await factory.connect(owner).deploy()
    //     // await expect(miniYakContract.deployed()).to.be.reverted
    //     await miniYakContract.deployed()
    // })

    it("Check for decimals", async function () {
        expect(await miniYakContract.decimals()).to.eq(
            12)
    })

    it("Check for Minimum amount Yak to be swapped", async function () {
        let YakToken = await ethers.getContractAt("IERC20", YAK_ADDRESS, account);
        const deposits = await YakToken.balanceOf(account.address);
        console.log(
            "Balance of Yak before moon:",
            deposits.toString()
        );
        const depositsOfmini = await miniYakContract.balanceOf(account.address);
        console.log(
            "Balance of miniYak before moon:",
            depositsOfmini.toString()
        );
        await YakToken.connect(account).approve(miniYakContract.address, "1")
        const allowance = await YakToken.allowance(account.address, miniYakContract.address)
        console.log(
            "Allowance in the miniYak contract:",
            allowance.toString()
        );
        await miniYakContract.connect(account).moon("1", account.address)
        const depositsOfminiAfter = await miniYakContract.balanceOf(account.address);
        console.log(
            "Balance miniYak after moon:",
            depositsOfminiAfter.toString()
        );
        const depositsofYakafterMoon = await YakToken.balanceOf(account.address);
        console.log(
            "Balance of yak after moon:",
            depositsofYakafterMoon.toString()
        );
        await miniYakContract.connect(account).unmoon("1", account.address)
        const depositsOfminiAfterwithdraw = await miniYakContract.balanceOf(account.address);
        console.log(
            "Balance of miniYak after unmoon:",
            depositsOfminiAfterwithdraw.toString()
        );
        const depositsofYakafterWithdraw = await YakToken.balanceOf(account.address);
        console.log(
            "Balance of yak after unmoon:",
            depositsofYakafterWithdraw.toString()
        );
    })

    it("Check for safe transfer of mini Yak", async function () {
        let YakToken = await ethers.getContractAt("IERC20", YAK_ADDRESS, account);
        const deposits = await YakToken.balanceOf(account.address);
        console.log(
            "Balance of Yak before moon:",
            deposits.toString()
        );
        const depositsOfmini = await miniYakContract.balanceOf(account.address);
        console.log(
            "Balance of miniYak before moon:",
            depositsOfmini.toString()
        );
        await YakToken.connect(account).approve(miniYakContract.address, "1")
        const allowance = await YakToken.allowance(account.address, miniYakContract.address)
        console.log(
            "Allowance in the miniYak contract:",
            allowance.toString()
        );
        await miniYakContract.connect(account).moon("1", account.address)
        const depositsOfminiAfter = await miniYakContract.balanceOf(account.address);
        console.log(
            "Balance miniYak after moon:",
            depositsOfminiAfter.toString()
        );
        const depositsforOwnerbeforeTransfer = await miniYakContract.balanceOf(owner.address);
        console.log(
            "Balance miniYak before transfer for Owner:",
            depositsforOwnerbeforeTransfer.toString()
        );
        await miniYakContract.connect(account).transfer(owner.address, "1")
        const depositsforOwnerAfterTransfer = await miniYakContract.balanceOf(owner.address);
        console.log(
            "Balance miniYak after transfer for Owner:",
            depositsforOwnerAfterTransfer.toString()
        );
        const depositsOfminiAfterTransfer = await miniYakContract.balanceOf(account.address);
        console.log(
            "Balance miniYak after transfer for signer",
            depositsOfminiAfterTransfer.toString()
        );
    })

})
