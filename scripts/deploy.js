const hre = require("hardhat");


async function main() {
  const DogelonMartians = await hre.ethers.getContractFactory("DogelonMartians");
  const dogelonMartians = await DogelonMartians.deploy('Dogelon Martians', 'MARTIANS', '');
  await dogelonMartians.deployed();
  console.log("DogelonMartians deployed to:", dogelonMartians.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
