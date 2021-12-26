// npx hardhat test ./test/02_fallout.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Fallout";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._02_fallout, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    tx = await levelContract.Fal1out();
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});