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

contract('MinorityReport', (accounts) => {
  let election;

  beforeEach('setup contract for each test', async () => {
    election = await Election.new();
  });

  describe('activate()', () => {
    it('should work correctly', async () => {
      await election.activate();
      const isVoting = await election.isVoting();
      assert.equal(isVoting, true);
    });

    it('should revert if it is not called by owner', async () => {
      tryCatch(election.activate({ from: accounts[1] }), 'Only owner is allowed');
    });
  });



  describe('endElection()', () => {
    it('should work correctly end game', async () => {
      await election.endElection();
      
      const isVoting = await election.isVoting();
      const totalVote = (await election.totalVote()).toNumber();
      const candidateList = await election.getCandidatesList();

      assert.equal(totalVote, 0);
      assert.equal(isVoting, false);
      assert.equal(candidateList.length, 0);
    });

    it('should work correclty at first round', async () => {
      // Bad smells(bad pratice) here. Please extract private functions to library to test it if you want to test those private functions.
      const vote = (targetCandidate, voter = accounts[1]) => election.vote(targetCandidate, { from: voter });

      await register('wayne', accounts[0]);
      await register('wei chao', accounts[1]);
      await register('william', accounts[2]);

      await election.startVoting();

      await vote(accounts[0], accounts[0]);
      await vote(accounts[0], accounts[1]);
      await vote(accounts[0], accounts[2]);
      await vote(accounts[1], accounts[3]);
      await vote(accounts[1], accounts[4]);
      await vote(accounts[2], accounts[5]);

      const { logs } = await election.resetElection();
      const electedEventIndex = logs.findIndex(log => log.event === 'elected');
      const refundEvents = logs.reduce((acc, log) => {
        if (log.event === 'refund') {
          acc.push(log);
        }

        return acc;
      }, []);

      const wayneRefundEvent = refundEvents.find(event => event.args.candidate === accounts[0]);
      const weiChaoRefundEvent = refundEvents.find(event => event.args.candidate === accounts[1]);
      const guaranteedDeposit = (await election.guaranteedDeposit()).toNumber();

      const candidateList = await election.getCandidatesList();
      const round = (await election.round()).toNumber();
      const isVoting = await election.isVoting();
      const totalVote = (await election.totalVote()).toNumber();

      assert.equal(totalVote, 0);
      assert.equal(round, 2);
      assert.equal(isVoting, false);
      assert.equal(candidateList.length, 0);

      assert.equal(refundEvents.length, 2);
      assert.equal(wayneRefundEvent.args.amount, guaranteedDeposit);
      assert.equal(weiChaoRefundEvent.args.amount, guaranteedDeposit);
      assert.equal(logs[electedEventIndex].args.round.toNumber(), 1);
      assert.equal(logs[electedEventIndex].args.candidate, accounts[0]);
      assert.equal(logs[electedEventIndex].args.name, 'wayne');
      assert.equal(logs[electedEventIndex].args.vote.toNumber(), 3);
    });

    it('should revert if it is not called by owner', async () => {
      tryCatch(election.resetElection({ from: accounts[1] }), 'Only owner is allowed');
    });
  });
  /*
  describe('getCandidatesList()', () => {
    it('should return list correctly', async () => {
      const candidateList = await election.getCandidatesList();

      assert(candidateList instanceof Array);
    });
  });
  */
});
