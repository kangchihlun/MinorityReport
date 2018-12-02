/* global artifacts */
const contract = artifacts.require('./PlayerBook.sol')

module.exports = async deployer => deployer.deploy(contract)
