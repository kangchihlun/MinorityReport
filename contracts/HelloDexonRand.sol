pragma solidity ^0.4.25;

contract HelloDexonRand {
    uint256 public value;
    function update() public {
        value = rand;
    }

    function get() public view returns (uint256) {
        return value;
    }
}
