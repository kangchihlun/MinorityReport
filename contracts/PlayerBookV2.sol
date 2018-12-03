pragma solidity ^0.4.19;

import "./lib/SafeMath.sol";

contract PlayerBookV2 {
    using SafeMath for uint256;

    modifier meetDepositRequirement(uint256 fee)
    {
        require(msg.value >= fee, "fee does not meet requirement");
        _;
    }

    struct User {
        address wallet;
        bytes32 name;
        uint256 affiliateId;
        uint256 claimable;
        uint256 level;
    }

    uint256 public totalUserCount = 1;                    // total players
    uint256 public registrationFee_ = 10 finney;          // price to register a name
    mapping (address => uint256) public uIdWallet_;       // (wallet => uId) returns user id by address
    mapping (bytes32 => uint256) public uIdName_;         // (name   => uId) returns user id by name
    mapping (uint256 => User) public user_;               // (uId    => data) user data

    constructor()
      public
    {
        user_[1].wallet = msg.sender;
        user_[1].name = "wayne";
        user_[1].affiliateId = 1;
        uIdWallet_[msg.sender] = 1;
        uIdName_["wayne"] = 1;
    }

    function getUserNameByAddress(address wallet)
        public
        view
        returns(bytes32)
    {
        return user_[uIdWallet_[wallet]].name;
    }

    function registerUser(bytes32 name, uint256 affiliateId)
        public
        meetDepositRequirement(registrationFee_)
        payable
    {
        address wallet = msg.sender;
        require(uIdName_[name] == 0, "names already taken");
        require(uIdWallet_[wallet] == 0, "address has been used");
        require(user_[affiliateId].affiliateId != 0, "this id does not exist");

        totalUserCount ++;
        
        user_[totalUserCount].wallet = wallet;
        user_[totalUserCount].name = name;
        user_[totalUserCount].affiliateId = affiliateId;
        user_[totalUserCount].claimable = 0;
        user_[totalUserCount].level = 1;
        uIdWallet_[wallet] = totalUserCount;
        uIdName_[name] = totalUserCount;

    }

    function deposit(address wallet)
        public
        payable
    {
        address defaultAddress;
        uint256 depositAmount = msg.value;
        if(wallet == defaultAddress) {
            user_[1].claimable = user_[1].claimable.add(depositAmount);
        }

        uint256 affiliationPortionAmount = depositAmount.div(100);
        uint256 playerId = uIdWallet_[wallet];
        uint256 affiliatePlayerId = user_[playerId].affiliateId;
        uint256 affiliateAffiliatePlayerId = user_[affiliatePlayerId].affiliateId;
        
        /*
          10% -> direct affiliate
          5% -> affiliate's affiliate
        */
        uint256 affiliationPortionAmountInTen = affiliationPortionAmount.mul(10);
        uint256 affiliationPortionAmountInFive = affiliationPortionAmount.mul(5);

        user_[affiliatePlayerId].claimable = user_[affiliatePlayerId].claimable.add(affiliationPortionAmountInTen);
        user_[affiliateAffiliatePlayerId].claimable = user_[affiliateAffiliatePlayerId].claimable.add(affiliationPortionAmountInFive);
        user_[playerId].claimable = user_[playerId]
          .claimable
          .add(
            depositAmount
              .sub(affiliationPortionAmountInTen)
              .sub(affiliationPortionAmountInFive)
            );
    }

    function claimMoney()
        public
    {
        address claimerAddress = msg.sender;
        User storage user = user_[uIdWallet_[claimerAddress]];
        require(user.claimable != 0, "you don't have money to claim");
        claimerAddress.transfer(user.claimable);
        user.claimable = 0;
    }
}

/*
TODO
  User
    - level
      - money would be given after leveling up
      - 
    - claimable 
    - claimableWhenBroken
    - 角色 [
      master,
      manager,
      ...
      ...
    ]
    - 
*/


