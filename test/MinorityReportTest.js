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
      assert.equal(logs[evnt_OnVoteStart_idx].args.round.toNumber(), 0);

      const isVoting = await election.isVoting();
      assert.equal(isVoting, true);
   
      //await election.activate({ from: accounts[0] });
      const { votelogs } = await election.Vote(0, { from: accounts[0], value: 1e+18 });
      const evnt_OnVoteToPot_idx = votelogs.findIndex(log => log.event === 'OnVoteToPot');

      // see if vote 1 success 
      const voter1_amt = await election.VoteHistory.call(1,accounts[0]);
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
