/* global artifacts it contract assert */

const Web3 = require('web3')
const { toChecksumAddress } = require('ethereumjs-util')

const GameMushroom = artifacts.require('./GameMushroom.sol')
const PlayerBookV2 = artifacts.require('./PlayerBookV2.sol')
const {
  div,
  mul,
  add,
  sub,
  lt,
} = require('../utils/calculation')

const { utils } = Web3

contract('PlayerBookV2', async (accounts) => {
  const [,
    account2,
    account3,
    account4,
    account5,
  ] = accounts
  const playerBookV2 = await PlayerBookV2.deployed()
  const gameMushroom = await GameMushroom.deployed()
  const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  const playerBook = new web3.eth.Contract(
    playerBookV2.abi,
    playerBookV2.address,
  )

  const mushroom = new web3.eth.Contract(
    gameMushroom.abi,
    gameMushroom.address,
  )

  const { eth: { getBalance } } = web3

  const {
    totalUserCount,
    registerUser,
    registrationFee_,
    user_,
    uIdWallet_,
    deposit,
    claimMoney,
  } = playerBook.methods

  const {
    gamer_,
    gameJoinFee_,
    joinGame,
    creature_,
    purchaseCreature,
    gamerCapabilityDeterminator,
    upgradeInfo,
  } = mushroom.methods

  it('can register user, and will match user init state', async () => {
    const registrationFee = await registrationFee_().call()
    const registerName = 'Q__Q'
    const registerAffiliateId = 1
    await registerUser(
      utils.toHex(registerName),
      registerAffiliateId,
    )
      .send({
        from: account2,
        value: registrationFee,
        gas: 3500000,
      })
    const userCount = await totalUserCount().call()
    const user = await user_(userCount).call()
    assert.isTrue(userCount === '2')
    assert.isTrue(
      toChecksumAddress(user.wallet) === toChecksumAddress(account2),
      'registered wallet is not the one who registered',
    )
    assert.isTrue(
      utils.toUtf8(user.name) === registerName,
      'name is different',
    )
    assert.isTrue(
      user.affiliateId === registerAffiliateId.toString(),
      'affiliateId is different',
    )
    assert.isTrue(
      user.claimable === '0',
      'not matching to init claimable',
    )
    assert.isTrue(
      user.level === '1',
      'not matching to init level',
    )
  })
  it('will throw error if a user use the same name', async () => {
    const registrationFee = await registrationFee_().call()
    try {
      await registerUser(
        utils.toHex('Q__Q'),
        1,
      )
        .send({
          from: account3,
          value: registrationFee,
          gas: 3500000,
        })
    } catch (error) {
      return
    }
    const userCount = await totalUserCount().call()
    assert.isTrue(userCount === '2')
    assert.fail('Expected throw not received')
  })
  it('will throw error if a user use the same address', async () => {
    const registrationFee = await registrationFee_().call()
    try {
      await registerUser(
        utils.toHex('Q___Q'),
        1,
      )
        .send({
          from: account2,
          value: registrationFee,
          gas: 3500000,
        })
    } catch (error) {
      return
    }
    const userCount = await totalUserCount().call()
    assert.isTrue(userCount === '2')
    assert.fail('Expected throw not received')
  })

  it('affiliate id cannot be self when registering', async () => {
    const registrationFee = await registrationFee_().call()
    const userCount = await totalUserCount().call()
    try {
      await registerUser(
        utils.toHex('Q___Q'),
        Number(userCount) + 1,
      )
        .send({
          from: account3,
          value: registrationFee,
          gas: 3500000,
        })
    } catch (error) {
      return
    }
    assert.isTrue(userCount === '2')
    assert.fail('Expected throw not received')
  })
  it('can register if id has decimal, solidity will fall back to integer', async () => {
    const registrationFee = await registrationFee_().call()

    await registerUser(
      utils.toHex('Q___Q'),
      2.9999999999999,
    )
      .send({
        from: account3,
        value: registrationFee,
        gas: 3500000,
      })

    const userCount = await totalUserCount().call()
    const user = await user_(userCount).call()

    assert.isTrue(
      userCount === '3',
      'has 3 users',
    )
    assert.isTrue(
      user.affiliateId === '2',
      'will fall back to if decimal is provided',
    )
    assert.isTrue(
      toChecksumAddress(user.wallet) === toChecksumAddress(account3),
    )
  })

  it('85% will goes to second user, and total of 15% will goes to affiliate', async () => {
    const depositAmount = utils.toWei('1', 'ether')
    const registrationFee = await registrationFee_().call()
    const snapshotUserCount = await totalUserCount().call()

    await registerUser(
      utils.toHex('Q____Q'),
      snapshotUserCount,
    )
      .send({
        from: account4,
        value: registrationFee,
        gas: 3500000,
      })

    await deposit(
      account4,
    ).send({
      from: account4,
      value: depositAmount,
      gas: 3500000,
    })
    const userCount = await totalUserCount().call()
    assert.isTrue(
      userCount === (Number(snapshotUserCount) + 1).toString(),
      `user count should be ${Number(snapshotUserCount) + 1}`,
    )

    const user4 = await user_(userCount).call()

    const affiliateUser = await user_(user4.affiliateId).call()
    const affiliateAffiliateUser = await user_(affiliateUser.affiliateId).call()
    assert.isTrue(
      mul(div(depositAmount, '100'), '85') === user4.claimable,
      'user should have 85%',
    )
    assert.isTrue(
      mul(div(depositAmount, '100'), '10') === affiliateUser.claimable,
      'affiliate should have 10%',
    )
    assert.isTrue(
      mul(div(depositAmount, '100'), '5') === affiliateAffiliateUser.claimable,
      'affiliate should have 5%',
    )
  })
  it('can claim money', async () => {
    const id = await uIdWallet_(account4).call()
    const snapshotUser4Balance = await getBalance(account4)
    const snapshotUser4 = await user_(id).call()
    await claimMoney().send({
      from: account4,
      gas: 3500000,
    })
    const user4 = await user_(id).call()
    const user4Balance = await getBalance(account4)
    const amount = sub(
      user4Balance,
      add(snapshotUser4Balance, '3500000', user4.claimable),
    )
    assert.isTrue(
      lt(amount, snapshotUser4.claimable),
      'claim more than it owns',
    )
    assert.isTrue(
      snapshotUser4Balance < user4Balance,
      'amount did not increase after claim',
    )
    assert.isTrue(
      user4.claimable === '0',
      'should reset to 0',
    )
  })
  it('cannot claim money', async () => {
    const snapshotUser4Balance = await getBalance(account4)
    try {
      await claimMoney().send({
        from: account4,
        gas: 3500000,
      })
    } catch (error) {
      return
    }
    assert.fail('Expected throw not received')
    const user4Balance = await getBalance(account4)
    assert.isTrue(
      lt(user4Balance, snapshotUser4Balance),
      'should not able to claim money',
    )
  })
  it('can join game', async () => {
    const gameJoinFee = await gameJoinFee_().call()
    const userId = await uIdWallet_(account2).call()
    const user = await user_(userId).call()
    await joinGame()
      .send({
        from: account2,
        value: gameJoinFee,
        gas: 3500000,
      })
    const gamer = await gamer_(account2).call()
    assert.isTrue(toChecksumAddress(gamer.wallet) === toChecksumAddress(account2))
    assert.isTrue(gamer.name === user.name)
    assert.isTrue(gamer.creatureCount === '1')
  })
  it('cannot join game if joined already', async () => {
    const gameJoinFee = await gameJoinFee_().call()
    try {
      await joinGame()
        .send({
          from: account2,
          value: gameJoinFee,
          gas: 3500000,
        })
    } catch (error) {
      return
    }
    assert.fail('Expected throw not received')
  })
  it('cannot join game if is not a registered user', async () => {
    const gameJoinFee = await gameJoinFee_().call()
    try {
      await joinGame()
        .send({
          from: account5,
          value: gameJoinFee,
          gas: 3500000,
        })
    } catch (error) {
      return
    }
    assert.fail('Expected throw not received')
  })
  it('can purchase creature', async () => {
    const creatureIndex = 2
    const creature = await creature_(creatureIndex).call()
    const score = await gamerCapabilityDeterminator(account2).call()
    assert.isTrue(score === '1')
    await purchaseCreature(creatureIndex)
      .send({
        from: account2,
        value: creature.cost,
        gas: 3500000,
      })
    const gamer = await gamer_(account2).call()
    assert.isTrue(gamer.creatureCount === '2')

    let r = await upgradeInfo(2).call()
    console.log(r);
    assert.isTrue(true)
    
  })
})
