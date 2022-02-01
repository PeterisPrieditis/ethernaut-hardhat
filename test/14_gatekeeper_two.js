// npx hardhat test ./test/14_gatekeeper_two.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "GatekeeperTwo";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._14_gatekeeper_two, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("GatekeeperTwoAttack");
    let attack = await attackFactory.deploy(levelContract.address);
    await attack.deployTransaction.wait();
    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});