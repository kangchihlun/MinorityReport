var safeMath  = artifacts.require('./SafeMath.sol');
var Minor = artifacts.require("./MinorityReport.sol");
// const HelloDexonRand = artifacts.require('./HelloDexonRand.sol')
module.exports = function (deployer, network, accounts) {
    console.log(accounts)
    deployer.deploy(safeMath).then(() => {
        deployer.link(safeMath, Minor);
        return deployer.deploy(Minor,accounts[0]);
    });
};


// module.exports = deployer => deployer.deploy(HelloDexonRand);