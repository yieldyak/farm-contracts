import { expect } from "chai"
import { ethers } from "hardhat"
import {run} from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts"
import { ContractFactory } from "ethers"

const hre = require("hardhat");

describe("MiniYak", async function() {

    let owner: SignerWithAddress
    let account: SignerWithAddress
    let miniYakContract: Contract

    before(async function() {
        //this makes sure the newest changes are compiled and pushed to the fork node
        run("compile")
    })
    
    beforeEach(async function() {
        owner = (await ethers.getSigners())[0]
        account = (await ethers.getSigners())[1]
        const factory = await ethers.getContractFactory("MiniYak")
        miniYakContract = await factory.connect(owner).deploy()
        // await expect(miniYakContract.deployed()).to.be.reverted
        await miniYakContract.deployed()
    })

    // it("Can be deployed", async function() {
    //     const factory = await ethers.getContractFactory("MiniYak")
    //     miniYakContract = await factory.connect(owner).deploy()
    //     // await expect(miniYakContract.deployed()).to.be.reverted
    //     await miniYakContract.deployed()
    // })

    it("Check for decimals", async function() {
        expect(await miniYakContract.decimals()).to.eq(
            12)
    })

    it("Check for Minimum amount Yak to be swapped", async function() {
        await hre.network.provider.request({method: "hardhat_impersonateAccount",params: ["0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f"]});
        const signer = hre.ethers.provider.getSigner("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f");
        const someContractAbi1 = require("./abis/YakToken.json");
        let YakToken = new ethers.Contract("0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7", someContractAbi1, signer);
        const deposits = await YakToken.balanceOf("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f");
        console.log(
            "Balance of Yak before moon:",
            deposits.toString()
          );
          const depositsOfmini = await miniYakContract.balanceOf("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f");
          console.log(
            "Balance of miniYak before moon:",
            depositsOfmini.toString()
          );
          await YakToken.connect(signer).approve(miniYakContract.address,"1")
          const allowance = await YakToken.allowance("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f",miniYakContract.address)
          console.log(
            "Allowance in the miniYak contract:",
            allowance.toString()
          );
        await miniYakContract.connect(signer).moon("1","0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f")
        const depositsOfminiAfter = await miniYakContract.balanceOf("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f");
          console.log(
            "Balance miniYak after moon:",
            depositsOfminiAfter.toString()
          );
          const depositsofYakafterMoon = await YakToken.balanceOf("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f");
          console.log(
              "Balance of yak after moon:",
              depositsofYakafterMoon.toString()
            );
        await miniYakContract.connect(signer).unmoon("1","0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f")
        const depositsOfminiAfterwithdraw = await miniYakContract.balanceOf("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f");
          console.log(
            "Balance of miniYak after unmoon:",
            depositsOfminiAfterwithdraw.toString()
          );
          const depositsofYakafterWithdraw = await YakToken.balanceOf("0x0cf605484A512d3F3435fed77AB5ddC0525Daf5f");
        console.log(
            "Balance of yak after unmoon:",
            depositsofYakafterWithdraw.toString()
          );
    })


})
