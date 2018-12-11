pragma solidity ^0.4.19;

import "./SafeMath.sol";

contract PlayerBookEvents {
    event onNewUser
    (
        address indexed UserAddress,
        bytes32 indexed userName
    );
}

contract PlayerBook is PlayerBookEvents {
    using SafeMath for uint256;

    uint256 public totalPlayerCount = 1;                    // total players
    uint256 public registrationFee_ = 10 finney;            // price to register a name
    mapping (address => uint256) public pIDxAddr_;          // (addr => pID) returns player id by address
    mapping (bytes32 => uint256) public pIDxName_;          // (name => pID) returns player id by name
    mapping (uint256 => Player) public plyr_;               // (pID => data) player data
    
    struct Player {
        address addr;
        bytes32 name;
        uint256 laff;
        uint256 claimable;
    }

    modifier meetDepositRequirement(uint256 _fee)
    {
        require(msg.value >= _fee, "fee does not meet requirement");
        _;
    }
    
    constructor()
        public
    {
        plyr_[1].addr = msg.sender;
        plyr_[1].name = "wayne";
        pIDxAddr_[msg.sender] = 1;
        pIDxName_["wayne"] = 1;
    }

    function getPlayerName(address _addr)
        public
        view
        returns(bytes32)
    {
        return plyr_[pIDxAddr_[_addr]].name;
    }
    
    function registerPlayer(bytes32 _nameString, uint256 _affCode)
        public
        meetDepositRequirement(registrationFee_)
        payable
    {
        // make sure the name has not been used
        require(pIDxName_[_nameString] == 0, "sorry that names already taken");

        // set up config
        address _addr = msg.sender;
        totalPlayerCount ++;
        
        plyr_[totalPlayerCount].addr = _addr;
        plyr_[totalPlayerCount].name = _nameString;
        pIDxAddr_[_addr] = totalPlayerCount;
        pIDxName_[_nameString] = totalPlayerCount;
        plyr_[totalPlayerCount].laff = _affCode;

        emit onNewUser(
            _addr,
            _nameString
        );
    }
    
}
