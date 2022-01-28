const hre = require("hardhat");

async function main() {

  const [deployer] = await hre.ethers.getSigners();

  // console.log("Deploying contracts with the account:", deployer.address);

  //   //Token1

  //   const Token1 = await hre.ethers.getContractFactory("Token1");
  
  //   const token1 = await Token1.deploy();
  
  //   await token1.deployed();
  //   console.log("Token1 contracts:", token1.address);

  // //Token2

  // const Token2 = await hre.ethers.getContractFactory("Token2");

  // const token2 = await Token2.deploy();

  // await token2.deployed();
  // console.log("Token2 contracts:", token2.address);


  // //Pair

  // const Pair = await hre.ethers.getContractFactory("Pair");

  // const pair = await Pair.deploy();

  // await pair.deployed();
  // console.log("Pair contracts:", pair.address);

  //Farm

  const Farm = await hre.ethers.getContractFactory("Farm");

  const farm = await Farm.deploy();

  await farm.deployed();
  console.log("Farm contracts:", farm.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });