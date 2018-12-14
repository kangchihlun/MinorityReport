const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
const Election = artifacts.require('./MinorityReport.sol');

const eventHelper = (logs, event) => logs.find(log => log.event)

async function tryCatch(promise, reason) {
  try {
    await promise;
  }
  catch (error) {
    const isErrorOccur = error.message.includes(reason);
    assert.equal(isErrorOccur, true, `Expected to fail with ${reason}, but failed with: ${error.message}`);
  }
};
//function ([owner])
contract('MinorityReport', (accounts)=> {

  let election

  // function declarations
  const vote = (idx, account, value = 1e+18) => election.Vote(idx, { from: account, value });

  beforeEach('setup contract for each test', async function () {
      election = await Election.new(accounts[0])
  })

  it('has an owner', async function () {
      assert.equal(await election.contractOwner(), accounts[0])
  })

  describe('[2]VotingProcess', () => {
    it('--->activate', async () => {
      const { logs } = await election.activate({ from: accounts[0] });
      const evnt_OnVoteStart_idx = logs.findIndex(log => log.event === 'OnVoteStart');
      // check round value is 1
      assert.equal(logs[evnt_OnVoteStart_idx].args.round.toNumber(), 1);

      // check is voting now
      const isVoting = await election.isVoting();
      assert.equal(isVoting, true);
      
      /////////////////////////////
      ///    vote simulation    ///
      /////////////////////////////

      // remember Account's balance before vote
      const prevBalance_a0 = (await web3.eth.getBalance(accounts[0])).toNumber();
      const prevBalance_a1 = (await web3.eth.getBalance(accounts[1])).toNumber();
      const prevBalance_a2 = (await web3.eth.getBalance(accounts[2])).toNumber();
      //assert.equal(prevBalance_a0, 1e+20);

      // do Account 0 's vote and see if event fire 
      const lowestID = await election.getPotValue(0);
      const { votelogs } = await election.Vote(0 , { from: accounts[0], value: 1e+18 });
      // can't fire event(Why?) , Cannot read property 'findIndex' of undefined
      //const evnt_OnVoteToPot_idx = votelogs.findIndex(log => log.event === 'OnVoteToPot');

      // // see if vote 1 success 
      // const voter1_amt = await election.VoteHistory.call(1,accounts[0]);

      await election.Vote(1, { from: accounts[0], value: 2e+18 });
      await election.Vote(2, { from: accounts[0], value: 3e+18 });

      await election.Vote(0, { from: accounts[1], value: 1e+18 });
      await election.Vote(1, { from: accounts[1], value: 2e+18 });
      await election.Vote(2, { from: accounts[1], value: 3e+18 });

      await election.Vote(0, { from: accounts[2], value: 1e+18 });
      await election.Vote(1, { from: accounts[2], value: 2e+18 });
      await election.Vote(2, { from: accounts[2], value: 3e+18 });

      // Which pot is the lowest now ? 
      const lowestIdx = Number(await election.compareLowest());
      //assert.equal(lowestIdx, 0);
      
      // // End Voting
      const { endlogs } = await election.endElection();
      //const evnt_OnElected_idx = endlogs.findIndex(log => log.event === 'OnElected');

      // // check lowest index is correct
      // assert.equal(endlogs[evnt_OnElected_idx].args.round.toNumber(), 1);
      // assert.equal(endlogs[evnt_OnElected_idx].args.whichPot.toNumber(), 0);

      const earn_0 = (await web3.eth.getBalance(accounts[0])).toNumber() - prevBalance_a0;
      const earn_1 = (await web3.eth.getBalance(accounts[1])).toNumber() - prevBalance_a1;
      const earn_2 = (await web3.eth.getBalance(accounts[2])).toNumber() - prevBalance_a2;

      
      assert.equal(earn_0, 1);
      // assert.equal(earn_0, 1);
      // assert.equal(earn_0, 1);
    });
  });

  // Test Get Function
  describe('[2]getVotersList', () => {
    it('get voter list', async () => {
      const voterList = await election.getVotersList();
      assert(voterList instanceof Array);
    });
  });

  
});
