// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  const MontyToken = await hre.ethers.getContractFactory("MontyToken");
  const montyToken = await MontyToken.deploy();

  await montyToken.deployed();

  console.log("MontyToken deployed to:", montyToken.address);

  const Vendor = await hre.ethers.getContractFactory("Vendor");
  const vendor = await Vendor.deploy(montyToken.address);

  await vendor.deployed();
  console.log("Vendor deployed to:", vendor.address);

  await montyToken.transfer(vendor.address, ethers.utils.parseEther("1000"));
  console.log("Successfully transfered tokens to Vendor.")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
