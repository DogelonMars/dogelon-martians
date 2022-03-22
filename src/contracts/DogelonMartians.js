import { Contract } from "ethers";
import DogelonMartiansArtifact from "../artifacts/contracts/DogelonMartians.sol/DogelonMartians.json"

export class DogelonMartians extends Contract {
  constructor(provider) {
    super(
      process.env.REACT_APP_DOGELON_MARTIANS_ADDRESS ?? '0x0',
      DogelonMartiansArtifact.abi,
      provider.OFFLINE ? provider : provider.getSigner());
  }
}