// npx hardhat test ./test/04_telephone.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Telephone";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._04_telephone, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("TelephoneAttack");
    let attack = await attackFactory.deploy();
    let tx = await attack.TelephoneChangeOwner(levelContract.address);
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});