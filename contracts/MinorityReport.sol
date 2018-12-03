pragma solidity ^0.4.24;
/*
    Voting dApp Game : Only The Minority Can Win.
    
    Last Modified by Chih Lun Kang.
    Last Modified date : 2018/12/2 
 */

import "./lib/Ownable.sol";
import "./lib/KeysCalculator.sol";
import "./lib/MinorityReportDataset.sol";
import "./lib/SafeMath.sol";
import "./lib/Math.sol";
contract MinorityReport is Ownable{

    struct VoteInfo{
        uint8 PoolID;  // which pool 
        uint256 VoteCount; // How many votes current address voted
    }

    address contractOwner;

    // (rID => data) round data
    mapping (uint256 => MinorityReportDataset.Round) public round_; 

    // ( Round  => ( Address => Vote ) )
    mapping(uint256 => mapping(address=>VoteInfo)) public VoteHistory;

    // Collection of voters , reset each Round
    address[] public VotersAddress;

    // Collection of Pot Value , reset each Round
    uint256[3] public EachPotValue;

    // 
    uint8[] lowestPotIdxArr;

    uint public Round=0;
    bool public isVoting = false;  // isVoting should be true when voting starts
    uint256 constant public EachRoundGap = 21 days;

    //==================================
    //    Modifiers (Safety Checks)
    //==================================

    modifier ownerOnly{
        // only team just can activate 
        require(
            msg.sender == 0xe8b9f9c74cFF70AeE28f74Fc4eB6a92911263081,
            // Wayne , fill your address here
            "only owner can touch"
        );
        _;
    }

    modifier isHuman() {
        address _addr = msg.sender;
        uint256 _codeLength;
        
        assembly {_codeLength := extcodesize(_addr)}
        require(_codeLength == 0, "sorry humans only");
        _;
    }

    modifier isWithinLimits(uint256 _eth) {
        require(_eth >= 1000000000, "pocket lint: not a valid currency");
        require(_eth <= 100000000000000000000000, "no vitalik, no");
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
    event OnElected(uint round,uint8 whichPot);
    event OnVoteToPot(uint8 whichPot,address whoVoted);
    event OnMinorityPotID_Changed(uint8 whichPot,uint256 amount);

    constructor (address _addr) public{
        require(_addr != address(0),"owner created");
        contractOwner = _addr;
    }



    //Fallback setup forward
    function()
    isActivated() 
    isWithinLimits(msg.value)
    public 
    payable{
        
    }

    // Contract Start Once Only
    bool public activated_ = false;
    function activate()
        public
    {
        // only team just can activate 
        require(
            msg.sender == 0xe8b9f9c74cFF70AeE28f74Fc4eB6a92911263081,
            // Wayne , fill your address here
            "only team just can activate"
        );

        
        // can only be ran once
        require(activated_ == false, "fomo3d already activated");
        
        // activate the contract 
        activated_ = true;
        
        // lets start first round
		Round = 1;
        //round_[1].strt = now + rndExtra_ - rndGap_;
        //round_[1].end = now + rndInit_ + rndExtra_;
    }


    function startElection() public payable {

    }
    function resetElection() public payable {        
        isVoting = false;

        // find the lowest funded pot
        uint256 lowestValue = 2**255;
        
        uint8 lowestPotIdx = 4;

        for(uint8 k = 0;k < 3;k++){
            if(EachPotValue[k]<=lowestValue){
                lowestValue = EachPotValue[k];
                lowestPotIdxArr.push(k);
            }
        }
        // if any of each pot has same amount
        // Use Dexon's Rand choose one as final index
        if(lowestPotIdxArr.length>1){
            //lowestPotIdx = rand % lowestPotIdxArr.length;
        }
        else if (lowestPotIdxArr.length == 1){
            lowestPotIdx = lowestPotIdxArr[0];
        }
        else{
            // something went wrong
        }


        emit OnElected(Round,lowestPotIdx);
        
        // Clear Data
        delete VotersAddress;
        delete EachPotValue;
        delete lowestPotIdxArr;
    }
}


