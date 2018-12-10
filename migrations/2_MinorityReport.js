var safeMath  = artifacts.require('./SafeMath.sol');
var Minor = artifacts.require("./MinorityReport.sol");
module.exports = function (deployer) {
    deployer.deploy(safeMath).then(() => {
        deployer.link(safeMath, Minor);
        return deployer.deploy(Minor);
    });
};