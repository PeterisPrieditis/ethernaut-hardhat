const { ethers } = require("hardhat");
const ETHERNAUT_LEVELS = require("../ethernaut-levels-config.js")

// manually copied from the website while inspect the web console's `ethernaut.abi`
const ETHERNAUT_ABI = require("../contracts/abi/ethernaut.json");
const ETHERNAUT_ADDRESS = ETHERNAUT_LEVELS.ethernaut_address;

async function createChallenge(contractLevel, value = 0) {
    try {
        const ethernaut = await ethers.getContractAt(
            ETHERNAUT_ABI,
            ETHERNAUT_ADDRESS
        );
        let tx = await ethernaut.createLevelInstance(contractLevel, { value });
        let receipt = await tx.wait();
        //console.log(receipt.logs);
        if (receipt.logs.length === 0) throw new Error("Transaction has no events!");
        let iface = new ethers.utils.Interface(ETHERNAUT_ABI);

        let log;
        for (let i = 0; i < receipt.logs.length || log == undefined; i++) {
            try {
                log = iface.parseLog(receipt.logs[i]);
            } catch {

            }
        }


        let instanceAddress = log.args.instance

        return instanceAddress;
    } catch (error) {
        console.error(`createChallenge: ${error.message}`);
        throw new Error(`createChallenge failed: ${error.message}`);
    }
}
async function getLevelContract(ethernautLevel, interfaceContract, value = 0) {
    let instanceAddress = await createChallenge(ethernautLevel, value);

    let levelContract = await ethers.getContractAt(
        interfaceContract,
        instanceAddress
    );
    return levelContract;
}
async function submitLevel(contractAddress) {
    try {
        const ethernaut = await ethers.getContractAt(
            ETHERNAUT_ABI,
            ETHERNAUT_ADDRESS
        );
        let tx = await ethernaut.submitLevelInstance(contractAddress);
        let receipt = await tx.wait();

        if (receipt.logs.length === 0) return false;
        let iface = new ethers.utils.Interface(ETHERNAUT_ABI);
        let log = iface.parseLog(receipt.logs[0]);
        return log.name === `LevelCompletedLog`;
    } catch (error) {
        console.error(`submitLevel: ${error.message}`);
        throw new Error(`submitLevel failed: ${error.message}`);
    }
}
module.exports = {
    createChallenge,
    getLevelContract,
    submitLevel
};