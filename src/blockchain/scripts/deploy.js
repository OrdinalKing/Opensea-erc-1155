const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Contract = await hre.ethers.getContractFactory("Marketplace");
  const contract = await hre.upgrades.deployProxy(Contract);
  // const greeter = await Contract.deploy(18, 70000000, "0xD671CaE333de3b38b58c11be5fEb185Ca40F3578", "0xD671CaE333de3b38b58c11be5fEb185Ca40F3578", 1, 1, 2);

  //await contract.deployed();

  // const update = await hre.upgrades.upgradeProxy("0xD62d0acB3ac8f4e4691DE1d338A01dA171CF525E", Contract);

  console.log("Contract deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });