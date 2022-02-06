// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_18_MagicNumber.sol";

contract MagicNumAttack {
    function attack(address contractAddress) public {
        // Example from MrTomph on how to solve challenge
        // https://github.com/MrToph/ethernaut/blob/master/contracts/18-MagicNumberAttacker.sol
        // Example for Solidity CREATE2
        // https://github.com/miguelmota/solidity-create2-example
        // https://github.com/stanislaw-glogowski/create2/blob/master/contracts/Factory.sol
        MagicNum magicNumber = MagicNum(contractAddress);
        bytes
            memory bytecode = hex"600a600c600039600a6000f3602a60005260206000f3";
        bytes32 salt = 0;
        address solverAddr;

        assembly {
            solverAddr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(solverAddr)) {
                revert(0, 0)
            }
        }

        magicNumber.setSolver(solverAddr);
    }
}
