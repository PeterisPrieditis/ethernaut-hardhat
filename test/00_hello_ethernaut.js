// npx hardhat test ./test/00_hello_ethernaut.js
// npx hardhat test ./test/00_hello_ethernaut.js --network rinkeby

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");


const ABI = require("../contracts/abi/00_hello_ethernaut.json");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;

async function getLevelContract(ethernautLevel) {
    let instanceAddress = await Utils.createChallenge(ethernautLevel)

    let levelContract = await ethers.getContractAt(
        ABI,
        instanceAddress
    );
    return levelContract;
}

before(async () => {
    const accounts = await ethers.getSigners();
    console.log("Using address: " + accounts[0].address);
    levelContract = await getLevelContract(ETHERNAUT_LEVELS._00_hello_ethernaut);
});

it("solves the level", async function () {
    let infos = await Promise.all([
        levelContract.info(),
        levelContract.info1(),
        levelContract.info2(`hello`),
        levelContract.infoNum(),
        levelContract.info42(),
        levelContract.theMethodName(),
        levelContract.method7123949(),
    ]);
    console.log(infos.join(`\n`));

    let password = await levelContract.password();
    console.log(`password = ${password}`);

    tx = await levelContract.authenticate(password);
    await tx.wait();
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});

