// npx hardhat test ./test/00_hello_ethernaut.ts

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { Contract, Signer } = require("ethers");


// manually copied from the website while inspect the web console's `ethernaut.abi`
const ETHERNAUT_ABI = require("../contracts/abi/ethernaut.json");
const ABI = require("../contracts/abi/00_hello_ethernaut.json");
const ETHERNAUT_ADDRESS = "0xD991431D8b033ddCb84dAD257f4821E9d5b38C33";

async function createChallenge(contractLevel) {
    try {
        const ethernaut = await ethers.getContractAt(
            ETHERNAUT_ABI,
            ETHERNAUT_ADDRESS
        );
        let tx = await ethernaut.createLevelInstance(contractLevel);
        const receipt = await tx.wait();

        if (receipt.logs.length === 0) throw new Error("Transaction has no events!");
        let iface = new ethers.utils.Interface(ETHERNAUT_ABI);
        let log = iface.parseLog(receipt.logs[0]);
        let instanceAddress = log.args.instance

        return instanceAddress;
    } catch (error) {
        console.error(`createChallenge: ${error.message}`);
        throw new Error(`createChallenge failed: ${error.message}`);
    }
}
async function getLevelContract() {
    let instanceAddress = await createChallenge("0x4E73b858fD5D7A5fc1c3455061dE52a53F35d966")
    let levelContract = await ethers.getContractAt(
        ABI,
        instanceAddress
    );
    return levelContract;
}

it("solves the challenge", async function () {
    let levelContract = getLevelContract();
    const infos = await Promise.all([
        levelContract.info(),
        levelContract.info1(),
        levelContract.info2(`hello`),
        levelContract.infoNum(),
        levelContract.info42(),
        levelContract.theMethodName(),
        levelContract.method7123949(),
    ]);
    console.log(infos.join(`\n`));

    expect(1 == 1);
});

