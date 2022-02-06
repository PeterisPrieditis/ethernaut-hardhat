// npx hardhat test ./test/18_magic_number.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "MagicNum";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._18_magic_number, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("MagicNumAttack");
    let attack = await attackFactory.deploy();
    let tx = await attack.attack(levelContract.address);
    await tx.wait();

    /*let attackFactory = await ethers.getContractFactory("ForceAttack");
    let attack = await attackFactory.deploy();
    let tx = await attack.attack(levelContract.address, { value: ethers.utils.parseUnits(`1`, `wei`) });
    await tx.wait();*/
    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});