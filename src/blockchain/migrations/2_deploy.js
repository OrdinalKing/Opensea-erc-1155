const Items = artifacts.require("Items");

module.exports = async(deployer) => {
  await deployer.deploy(Items);
};