// npx hardhat test ./test/20_denial.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Denial";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._20_denial, INTERFACE_CONTRACT, ethers.utils.parseUnits(`1`, `ether`));
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("DenialAttack");
    let attack = await attackFactory.deploy();
    let tx = await attack.attack(levelContract.address);
    await tx.wait();
    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});