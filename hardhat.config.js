require("@nomiclabs/hardhat-ethers");
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",
  artifacts: './src/artifacts',
};
