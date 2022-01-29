// npx hardhat test ./test/09_king.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "King";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._09_king, INTERFACE_CONTRACT, ethers.utils.parseUnits(`1`, `ether`));
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("KingAttack");
    let attack = await attackFactory.deploy();
    let prize = await levelContract.prize();
    console.log(prize);
    let tx = await attack.attack(levelContract.address, { value: prize });
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});