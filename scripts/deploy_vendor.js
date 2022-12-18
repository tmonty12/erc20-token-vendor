// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = require("ethers")
require('.dotenv').config()

const network = hre.network.name

async function main() {
  let tokenAddress
  if (network === 'localhost') {
    tokenAddress = process.env.REACT_APP_LOCALHOST_TOKEN_ADDRESS
  } else if (network === 'goerli') {
    tokenAddress = process.env.REACT_APP_GOERLI_TOKEN_ADDRESS
  } else {
    console.log(`${network} is not valid network`)
    return
  }

  const Vendor = await hre.ethers.getContractFactory("Vendor");
  const vendor = await Vendor.deploy(tokenAddress);

  await vendor.deployed();
  console.log("Vendor deployed to:", vendor.address);

  const MontyToken = await hre.ethers.getContractFactory("MontyToken");
  const montyToken = MontyToken.attach(tokenAddress);
  await montyToken.transfer(vendor.address, ethers.utils.parseEther("1000"));
  console.log("Successfully transfered tokens to Vendor.")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
