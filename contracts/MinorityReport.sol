pragma solidity ^0.4.25;
/*
    Voting dApp Game : Only The Minority Can Win.
    
    Last Modified by Chih Lun Kang.
    Last Modified date : 2018/12/2 
 */

import "./PlayerGameV2.sol";
contract MinorityReport is PlayerBookV2 {
    using SafeMath for *;
    using Math for *;
    struct VoteInfo{
        uint256 Count; // How many vote(keys) current address voted
        uint8 PoolID; // which pool 
    }

    address contractOwner;
    // { round counter => { Address => Vote } }
    mapping(uint256 => mapping(address=>VoteInfo)) public VoteHistory;

    // Collection
    address[] public votersAddress;

    uint public Round=1;
    uint256 public RoundStartTime; // lastTime of round start
    uint256 constant public EachRoundGap = 21 days;

    //==================================
    //    Modifiers (Safety Checks)
    //==================================

    modifier ownerOnly{
        // only team just can activate 
        require(
            msg.sender == 0xe8b9f9c74cFF70AeE28f74Fc4eB6a92911263081,
            "only owner can touch"
        );
        _;
    }

    /**
     * @dev used to make sure no one can interact with contract until it has 
     * been activated. 
     */
    modifier isActivated() {
        require(activated_ == true, "its not ready yet.  check ?eta in discord"); 
        _;
    }

    //==================================
    //    Events
    //==================================
    event OnVoteStart(uint round);
    event OnElected(uint round,uint8 whichPool);
    event OnVoteToPool(uint8 whichPool,address whoVoted);
    event OnMinorityPoolID_Changed(uint8 whichPool,uint256 amount);

    function ResetElection() public payable {

    }
}


library Math {
    /**
    * @dev Returns the largest of two numbers.
    */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    /**
    * @dev Returns the smallest of two numbers.
    */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
    * @dev Calculates the average of two numbers. Since these are integers,
    * averages of an even and odd number cannot be represented, and will be
    * rounded down.
    */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow, so we distribute
        return (a / 2) + (b / 2) + ((a % 2 + b % 2) / 2);
    }

   
}
