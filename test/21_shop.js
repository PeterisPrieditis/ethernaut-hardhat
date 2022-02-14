// npx hardhat test ./test/21_shop.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Shop";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._21_shop, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    //let dummyFactory = await ethers.getContractFactory("Shop");
    //let dymmy = await dummyFactory.deploy();

    let attackFactory = await ethers.getContractFactory("ShopAttack");
    let attack = await attackFactory.deploy();
    await attack.deployTransaction.wait();
    //let tx = await attack.attack(dymmy.address, { value: ethers.utils.parseUnits(`0`, `wei`) });
    let tx = await attack.attack(levelContract.address, { value: ethers.utils.parseUnits(`0`, `wei`) });
    await tx.wait();
    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});