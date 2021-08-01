import { expect } from "chai"
import { ethers } from "hardhat"
import {run} from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts"

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
    })

    it("Can be deployed", async function() {
        const factory = await ethers.getContractFactory("MiniYak")
        miniYakContract = await factory.connect(owner).deploy()
        // await expect(miniYakContract.deployed()).to.be.reverted
        await miniYakContract.deployed()
    })

})
