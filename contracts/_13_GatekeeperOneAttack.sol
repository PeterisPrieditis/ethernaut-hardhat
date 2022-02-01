// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./_13_GatekeeperOne.sol";

contract GatekeeperOneAttack {
    GatekeeperOne public levelContract;

    constructor(address gateAddress) public {
        levelContract = GatekeeperOne(gateAddress);
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(tx.origin),
            "GatekeeperOne: invalid gateThree part three"
        );
        _;
    }

    function testGateThree(address _address) public pure {
        GatekeeperOne gate = GatekeeperOne(_address);
    }

    function attack(bytes8 _gateKey) public {
        levelContract.enter(_gateKey);
    }
}
