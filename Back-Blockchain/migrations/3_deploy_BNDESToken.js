var owned = artifacts.require("./owned.sol");
var TokenERC20 = artifacts.require("./TokenERC20.sol");
var BNDESToken = artifacts.require("./BNDESToken.sol");

module.exports = function(deployer) {
	//Aproveita o deploy feito no 2_...js do TokenERC20 e owned
	//deployer.deploy(TokenERC20, 1000000, "BNDESToken", "BND");
	//deployer.deploy(owned);
	deployer.link (TokenERC20, BNDESToken);
	deployer.link(owned, BNDESToken);
	deployer.deploy(BNDESToken);
};
