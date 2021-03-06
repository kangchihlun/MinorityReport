pragma solidity ^0.4.24;
/*
    Voting dApp Game : Only The Minority Can Win.
    
    Last Modified by Chih Lun Kang.
    Last Modified date : 2018/12/2 
 */

import "./SafeMath.sol";
import "./PlayerGameV2.sol";
import "./Math.sol";

contract MinorityReport {
    using SafeMath for uint256;
    // address constant playbookContractAddress_ = 0x2c8e17013d0b76f7AA3976d64f9666592f4cf57d;
    // PlayerBookInterface constant private PlayerBook = PlayerBookInterface(playbookContractAddress_);
    struct Round {  
        uint256 end;    // time ends/ended
        bool ended;     // has round end function been ran
        uint256 strt;   // time round started
        uint256 keys;   // keys
        uint256 eth;    // total eth in
        uint256 pot;    // eth to pot (during round) / final amount paid to winner (after round ends)
        uint256 mask;   // global mask
        uint256 ico;    // total eth sent in during ICO phase
        uint256 icoGen; // total eth for gen during ICO phase
        uint256 icoAvg; // average key price for ICO phase
    }

    address public contractOwner;

    // (rID => data) round data
    mapping (uint256 => Round) public round_; 

    // ( Round  => ( Address => ( potID => amount) ) ) )
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) public VoteHistory;
    
    // temp used for looping VoteHistory 
    address[] public tempVoterArr;

    // number of pots
    uint8 constant private unmPots = 3; 

    // lowest pot currently
    uint private lowestPotIdx = 4;

    // Collection of Pot Value , reset each Round
    uint256[unmPots] public EachPotValue;

    // round timer starts at this
    uint256 constant private rndInit_ = 1 hours; 

    // duration of each round
    uint256 constant private rndGap_ = 21 days;

    // maybe duration of ico
    uint256 constant private rndExtra_ = 40 days; 

    // round id number / total rounds that have happened
    uint256 public rID_;    

    // isVoting should be true when voting starts
    bool public isVoting = false;  
    
    //==================================
    //    Modifiers (Safety Checks)
    //==================================

    modifier ownerOnly {
        // only team just can activate 
        require(
            msg.sender == 0xe8b9f9c74cFF70AeE28f74Fc4eB6a92911263081 ||
            msg.sender == contractOwner
            ,
            // Wayne , fill your address here
            "only owner can touch"
        );
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

    // //==================================
    // //    Events
    // //==================================
    event OnVoteStart(uint round);
    event OnElected(uint round,uint whichPot);
    event OnVoteToPot(uint whichPot,address whoVoted,uint256 value);
    event OnMinorityPotID_Changed(uint8 whichPot,uint256 amount);


    constructor (address _addr) public{
        require(_addr != address(0),"owner created");
        contractOwner = _addr;
    }


    //Fallback setup forward
    function()
    public
    isActivated() 
    isWithinLimits(msg.value)
    payable{
        Vote(1);
    }

    // // Contract Start Once Only
    bool public activated_ = false;
    function activate() 
    public
    ownerOnly()
    {
        // can only be ran once
        require(activated_ == false, "Minority Report already activated");
        
        // activate the contract 
        activated_ = true;
        
        // lets start first round
        rID_ = 1;
        round_[rID_].strt = block.timestamp;
        round_[rID_].end = block.timestamp + rndGap_;
        
        startElection();
    }

    /**
     *     Core Function
     */
    function Vote(uint whichPot)
        public
        isWithinLimits(msg.value)
        payable
    {
        require(activated_,"not activated ");
        require(isVoting,"vote phase not even started");
        require(whichPot < unmPots && whichPot >= 0 ,"wrong pot index" ); 
           
        //uint256 playerId = uIdWallet_[wallet];
        //uint256 affiliatePlayerId = user_[playerId].affiliateId;
        //uint256 affiliateAffiliatePlayerId = user_[affiliatePlayerId].affiliateId;

        // setup local rID
        uint256 _rID = rID_;
        
        // grab time
        uint256 _now = now;
        
        // if round is active
        if ( _now >= round_[_rID].strt && (_now <= round_[_rID].end) ) 
        {
            // [ NOT OPEN YET ] calc value based on time remain
            /*
            uint256 timeMulRatio = 1000000000000;
            uint256 timeLeft = _now - round_[_rID].end;
            timeLeft = SafeMath.mul(timeLeft,timeMulRatio);
            uint256 gameDuration = Math.max( round_[_rID].end - round_[_rID].start , 1);
            gameDuration = SafeMath.mul(gameDuration,timeMulRatio);
            uint256 timeLeftFraction = SafeMath.div(timeLeft,gameDuration);
            uint256 timeLeftFraction_inv = timeMulRatio - timeLeftFraction;
            uint256 availableKeys = msg.value / oneDex + SafeMath.div(timeLeftFraction_inv,timeMulRatio)
            */
            EachPotValue[whichPot] += msg.value;

            // insert temp address list of voters 
            if( (VoteHistory[_rID][msg.sender][0]==0)&&
                (VoteHistory[_rID][msg.sender][1]==0)&&
                (VoteHistory[_rID][msg.sender][2]==0)
              ){
                tempVoterArr.push(msg.sender);
            }

            VoteHistory[_rID][msg.sender][whichPot] += msg.value;
            // compare the lowest 
            lowestPotIdx = compareLowest();
        }
        emit OnVoteToPot(whichPot,msg.sender,msg.value);
    }

    function getPotValue(uint8 idx) public view returns (uint256) {
        return EachPotValue[idx];
    }

    function getTgtAddrPotValue(uint8 idx,address addr) public view returns (uint256) {
        return VoteHistory[rID_][addr][idx];
    }

    function getVotersList() public view returns (address[]) {
        return tempVoterArr;
    }

    function compareLowest() public returns (uint){
        int numSameValue = 0;
        uint[] memory lowestPotIdxArr = new uint[](unmPots);
        // find the lowest funded pot
        uint256 lowestValue = 2**255;
        
        lowestPotIdx = 4;

        for(uint8 k = 0;k < 3;k++){
            if(EachPotValue[k]<=lowestValue){
                lowestValue = EachPotValue[k];
                lowestPotIdxArr[k] = k;
                numSameValue++;
            }
        }
        // if any of each pot has same amount
        // Use Dexon's Rand choose one as final index
        if(numSameValue>1){
            //uint res = rand % lowestPotIdxArr.length;
            //lowestPotIdx = lowestPotIdxArr[res]; 
        }
        else if (numSameValue == 1){
            lowestPotIdx = lowestPotIdxArr[0];
        }
        else{
            // something went wrong
        }
        return lowestPotIdx;
    }
    
    function startElection() public payable {
        require(!isVoting,"already started");
        isVoting = true;
        for(uint k = 0;k<3;k++)
            EachPotValue[k] = 0;
        emit OnVoteStart(rID_);
    }

    function endElection() public payable {        
        isVoting = false;

        lowestPotIdx = compareLowest();
        
        // pay our winners ,distribute rewards
        distributeRewards();

        emit OnElected(rID_,lowestPotIdx);

        // Clear Data
        delete EachPotValue;
        delete tempVoterArr;

        // start next round
        rID_++;
        round_[rID_].strt = now;
        round_[rID_].end = now + (rndGap_);
        startElection();
    }

    /**
     * @dev returns time left.  dont spam this, you'll ddos yourself from your node 
     * provider
     * -functionhash- 0xc7e284b8
     * @return time left in seconds
     */
    function getTimeLeft()
        public
        view
        returns(uint256)
    {
        // setup local rID
        uint256 _rID = rID_;
        
        // grab time
        uint256 _now = now;
        
        if (_now < round_[_rID].end)
            if (_now > round_[_rID].strt + rndGap_)
                return( (round_[_rID].end) - (_now) );
            else
                return( (round_[_rID].strt + rndGap_) - (_now) );
        else
            return(0);
    }

    function distributeRewards() public payable {
        // Total Dex , Dev Team Take 10%
        uint256 totalMoney = EachPotValue[0]+EachPotValue[1]+EachPotValue[2];
        uint256 devTeamShare = SafeMath.div(totalMoney,10);
        uint256 rewards_remain = totalMoney - devTeamShare;
        uint256 targetPot_value = EachPotValue[lowestPotIdx];
        contractOwner.transfer(devTeamShare);
        
        for(uint k = 0;k<tempVoterArr.length;k++)
        {
            address curAddr = tempVoterArr[k];
            uint256 thisAddrVoteAmt = VoteHistory[rID_][curAddr][uint8(lowestPotIdx)];
            uint256 voteFraction = SafeMath.percent(thisAddrVoteAmt,targetPot_value,3);

            uint256 howMuchThisAddrGet = SafeMath.mul(rewards_remain,voteFraction);
            howMuchThisAddrGet = SafeMath.div(howMuchThisAddrGet,1000);
            curAddr.transfer(howMuchThisAddrGet);
        }
    }
}


