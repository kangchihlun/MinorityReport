pragma solidity ^0.4.25;
contract _24HourTransporting {
    using SafeMath for *;
    using Math for *;

    address contractOwner;

    // price history of all item
    enum Items {ITEM_OIL, ITEM_WEAPON, ITEM_DROGS}

    // { round counter => { Item type => price } }
    mapping(uint256 => mapping(uint8=>uint256)) private ItemPriceHistory;

    uint public Round=1;
    uint256 public LastSettlementTime; // lastTime of round set(24 hours ago)
    uint256 constant public EachRoundSettlementDuration = 24 hours;

    constructor() public
    {
        LastSettlementTime = block.timestamp;
        contractOwner = msg.sender;
        // set initial item price
        ItemPriceHistory[Round][Items.ITEM_OIL] = 1500;
        ItemPriceHistory[Round][Items.ITEM_WEAPON] = 1500;
        ItemPriceHistory[Round][Items.ITEM_DROGS] = 1500;
    }

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
    
    /**
     * @dev prevents contracts from interacting with fomo3d 
     */
    modifier isHuman() {
        address _addr = msg.sender;
        uint256 _codeLength;
        
        assembly {_codeLength := extcodesize(_addr)}
        require(_codeLength == 0, "sorry humans only");
        _;
    }

    /**
     * @dev sets boundaries for incoming tx 
     */
    modifier isWithinLimits(uint256 _eth) {
        require(_eth >= 1000000000, "pocket lint: not a valid currency");
        require(_eth <= 100000000000000000000000, "no popo, no");
        _;    
    }

    bool public activated_ = false;
    function activate()
        public
    {
        // only team just can activate 
        require(
            msg.sender == 0x18E90Fc6F70344f53EBd4f6070bf6Aa23e2D748C ||
            msg.sender == 0x8b4DA1827932D71759687f925D17F81Fc94e3A9D ||
            msg.sender == 0x8e0d985f3Ec1857BEc39B76aAabDEa6B31B67d53 ||
            msg.sender == 0x7ac74Fcc1a71b106F12c55ee8F802C9F672Ce40C ||
			msg.sender == 0xF39e044e1AB204460e06E87c6dca2c6319fC69E3,
            "only team just can activate"
        );

		// make sure that its been linked.
        require(address(otherF3D_) != address(0), "must link to other FoMo3D first");
        
        // can only be ran once
        require(activated_ == false, "fomo3d already activated");
        
        // activate the contract 
        activated_ = true;
        
        // lets start first round
		rID_ = 1;
        round_[1].strt = now + rndExtra_ - rndGap_;
        round_[1].end = now + rndInit_ + rndExtra_;
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
library SafeMath {
    /**
    * @dev Multiplies two numbers, reverts on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
    * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
    * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
    * @dev Adds two numbers, reverts on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
    * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}