import { expect } from "chai"
import { ethers } from "hardhat"
import {run} from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts"

describe("YakAVAX", async function() {

    let owner: SignerWithAddress
    let account: SignerWithAddress
    let yakAVAXContract: Contract

    before(async function() {
        //this makes sure the newest changes are compiled and pushed to the fork node
        run("compile")
    })
    
    beforeEach(async function() {
        owner = (await ethers.getSigners())[0]
        account = (await ethers.getSigners())[1]
    })

    it("Can be deployed", async function() {
        const factory = await ethers.getContractFactory("YakAVAX")
        yakAVAXContract = await factory.connect(owner).deploy()
        // await expect(miniYakContract.deployed()).to.be.reverted
        await yakAVAXContract.deployed()
        console.log("Account balance of Owner before deposit:", (await owner.getBalance()).toString());
        await yakAVAXContract.connect(owner).deposit({from: owner.address, value: "40000000000000000000"});
        console.log("Account balance after deposit:", (await owner.getBalance()).toString());
        console.log("YakAVAX balance of Owner after deposit:", (await yakAVAXContract.connect(owner).balanceOf(await owner.getAddress())).toString());
        await yakAVAXContract.connect(owner).withdraw("40000000000000000000");
        console.log("Account balance of owner after withdraw:", (await owner.getBalance()).toString());
        console.log("Account balance:", (await yakAVAXContract.connect(owner).balanceOf(await owner.getAddress())).toString());
    
    })

})
