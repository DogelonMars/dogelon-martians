const hre = require("hardhat");


async function main() {
  const dogelonMartians = await hre.ethers.getContractAt(
    "DogelonMartians",
    process.env.REACT_APP_DOGELON_MARTIANS_ADDRESS,
  );
  const tx = await dogelonMartians.activate()
  await tx.wait()
  console.log('activated!')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
